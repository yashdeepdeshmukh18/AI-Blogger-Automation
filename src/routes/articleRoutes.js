const express = require("express");
const Article = require("../models/Article");
const generateArticle = require("../services/aiService");

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const articleData = await generateArticle();

    const article = await Article.create({
      title: articleData.title,
      body: articleData.body,
      tags: articleData.tags,
      status: "PENDING",
    });

    res.status(201).json(article);
  } catch (error) {
    console.error("Article generation failed:", error.message);
    res.status(500).json({
      message: "Failed to generate article",
    });
  }
});

module.exports = router;