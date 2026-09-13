const express = require("express");
const Article = require("../models/Article");
const generateArticle = require("../services/aiService");

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const existingArticles = await Article.find({}, "title");

    const existingTitles = existingArticles.map(
      (article) => article.title
    );

    const articleData = await generateArticle(existingTitles);

    const article = await Article.create({
      title: articleData.title,
      normalizedTitle: articleData.title.trim().toLowerCase(),
      body: articleData.body,
      tags: articleData.tags,
      status: "PENDING",
    });

    console.log(
      `Article generated and saved as PENDING: ${article.title}`
    );

    res.status(201).json(article);
  } catch (error) {
    console.error("Article generation failed:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Duplicate article title generated. Please try again.",
      });
    }
    
    res.status(500).json({
      message: "Failed to generate article",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const articles = await Article.find()
      .sort({ createdAt: -1 })
      .select("title status retryCount createdAt");

    res.json(articles);
  } catch (error) {
    console.error("Failed to fetch articles:", error.message);

    res.status(500).json({
      message: "Failed to fetch articles",
    });
  }
});

module.exports = router;