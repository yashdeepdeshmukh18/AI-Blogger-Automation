const cron = require("node-cron");
const Article = require("../models/Article");
const { publishToBlogger } = require("../services/bloggerService");

const publishPendingArticle = async () => {
  try {
    const article = await Article.findOne({
      status: "PENDING",
    }).sort({ createdAt: 1 });

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
  }
};

const startPublishJob = () => {
    cron.schedule("0 * * * *", publishPendingArticle);
  console.log("Hourly Blogger publishing job started");
};

module.exports = startPublishJob;