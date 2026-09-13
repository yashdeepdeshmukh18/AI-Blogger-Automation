const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");
const TOKEN_PATH = path.join(process.cwd(), "token.json");

const credentials = JSON.parse(
  fs.readFileSync(CREDENTIALS_PATH, "utf-8")
);

const { client_id, client_secret, redirect_uris } = credentials.web;

const oauth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  "http://localhost:5000/oauth2callback"
);

const SCOPES = ["https://www.googleapis.com/auth/blogger"];

const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
};

const saveToken = (code) => {
  return new Promise((resolve, reject) => {
    oauth2Client.getToken(code, (error, tokens) => {
      if (error) return reject(error);

      oauth2Client.setCredentials(tokens);

      fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));

      resolve(tokens);
    });
  });
};

const loadToken = () => {
  if (!fs.existsSync(TOKEN_PATH)) {
    return false;
  }

  const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
  oauth2Client.setCredentials(token);

  return true;
};

module.exports = {
  oauth2Client,
  getAuthUrl,
  saveToken,
  loadToken,
};