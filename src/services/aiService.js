const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateArticle = async (existingTitles = []) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-3.6-flash",
  });

  const prompt = `
    Generate a useful and engaging blog article about stock market education for GODSTOCKSS.

    Avoid these already-used article titles:
    ${existingTitles.length ? existingTitles.join("\n") : "None"}

    Return JSON only in this format:
    {
      "title": "Article title",
      "body": "Article content",
      "tags": ["tag1", "tag2"]
    }
    `;

  const result = await model.generateContent(prompt);
  // const result = await model.generateContent("Say hello");

  let response = result.response.text().trim();

  response = response
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  return JSON.parse(response);
};

module.exports = generateArticle;