const { google } = require("googleapis");
const { oauth2Client, loadToken } = require("./bloggerAuth");

const getBloggerClient = () => {
  const tokenLoaded = loadToken();

  if (!tokenLoaded) {
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

module.exports = {
  getBlogs,
};