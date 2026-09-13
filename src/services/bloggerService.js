const { google } = require("googleapis");
const { oauth2Client, loadToken } = require("./bloggerAuth");

const getBloggerClient = () => {
  if (!loadToken()) {
    throw new Error("Google OAuth required. Visit /auth/google first.");
  }

  return google.blogger({
    version: "v3",
    auth: oauth2Client,
  });
};

const getBlogs = async () => {
  const blogger = getBloggerClient();

  const response = await blogger.blogs.listByUser({
    userId: "self",
  });

  return response.data.items || [];
};

const publishToBlogger = async ({ title, body }) => {
  const blogger = getBloggerClient();

  const response = await blogger.posts.insert({
    blogId: process.env.BLOGGER_BLOG_ID,
    requestBody: {
      title,
      content: body,
    },
  });

  return response.data;
};

module.exports = {
  getBlogs,
  publishToBlogger,
};