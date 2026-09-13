require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const articleRoutes = require("./routes/articleRoutes");
const {
  getAuthUrl,
  saveToken,
} = require("./services/bloggerAuth");
const { getBlogs } = require("./services/bloggerService");
const Article = require("./models/Article");
const { publishToBlogger } = require("./services/bloggerService");

const app = express();

app.use(express.json());
app.use("/api/articles", articleRoutes);

connectDB();


app.get("/", (req, res) => {
  res.json({ message: "AI Blogger Automation API running" });
});

app.get("/auth/google", (req, res) => {
  const authUrl = getAuthUrl();
  res.redirect(authUrl);
});

app.get("/oauth2callback", async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).send("Authorization code missing");
    }

    await saveToken(code);

    res.send("Google OAuth successful. You can close this tab.");
  } catch (error) {
    console.error("OAuth failed:", error.message);
    res.status(500).send("Google OAuth failed");
  }
});

app.get("/api/blogger/blogs", async (req, res) => {
  try {
    const blogs = await getBlogs();

    res.json(
      blogs.map((blog) => ({
        id: blog.id,
        name: blog.name,
        url: blog.url,
      }))
    );
  } catch (error) {
    console.error("Failed to fetch Blogger blogs:", error.message);
    res.status(500).json({
      message: "Failed to fetch Blogger blogs",
      error: error.message,
    });
  }
});

app.post("/api/articles/:id/publish", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    if (article.status === "PUBLISHED") {
      return res.status(400).json({
        message: "Article already published",
      });
    }

    const bloggerPost = await publishToBlogger({
      title: article.title,
      body: article.body,
    });

    article.status = "PUBLISHED";
    await article.save();

    res.json({
      message: "Article published successfully",
      bloggerPostUrl: bloggerPost.url,
      article,
    });
  } catch (error) {
    console.error("Publishing failed:", error.message);

    res.status(500).json({
      message: "Failed to publish article",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});