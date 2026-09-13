const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateArticle = async () => {
  const model = genAI.getGenerativeModel({
    model: "gemini-3.6-flash",
  });

  const prompt = `
Generate a useful and engaging blog article about
stock market education for GODSTOCKSS.

Return JSON only:
{
  "title": "Article title",
  "body": "Article content",
  "tags": ["tag1", "tag2"]
}
`;

  const result = await model.generateContent(prompt);

  const response = result.response.text();

  return JSON.parse(response);
};

module.exports = generateArticle;