const cron = require("node-cron");
const Article = require("../models/Article");
const { publishToBlogger } = require("../services/bloggerService");

const publishPendingArticle = async () => {
  let article;

  try {
    article = await Article.findOneAndUpdate(
        { status: "PENDING" },
        {
            $set: {
            status: "PROCESSING",
            },
        },
        {
            sort: { createdAt: 1 },
            returnDocument: "after",
        }
    );

    if (!article) {
      console.log("No pending articles to publish");
      return;
    }

    console.log(`Publishing article: ${article.title}`);

    const bloggerPost = await publishToBlogger({
      title: article.title,
      body: article.body,
    });

    article.status = "PUBLISHED";
    await article.save();

    console.log(`Published successfully: ${bloggerPost.url}`);
  } catch (error) {
    console.error("Scheduled publishing failed:", error.message);

    if (article) {
        article.retryCount += 1;

        if (article.retryCount >= 3) {
            article.status = "FAILED";
            console.log("Maximum retries reached. Article marked as FAILED.");
        } else {
            article.status = "PENDING";
            console.log(
                `Retry scheduled. Attempt ${article.retryCount}/3`
            );
        }

        await article.save();
    }
   }
};

const startPublishJob = () => {
  cron.schedule("0 * * * *", publishPendingArticle);

  console.log("Hourly Blogger publishing job started");
};

module.exports = startPublishJob;