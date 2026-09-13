# AI Blogger Automation

An automated backend pipeline that generates AI-powered blog articles using Google Gemini and publishes them to Blogger.com through the Blogger API.

The application uses MongoDB to store articles and track their publishing status. A scheduled cron job automatically publishes pending articles every hour.

## Features

* AI-generated blog articles using Google Gemini
* Duplicate-title prevention
* MongoDB article storage
* Article status tracking
* Automatic hourly Blogger publishing
* Google OAuth2 authentication
* Retry mechanism for failed publishing attempts
* Maximum retry limit of 3 attempts
* REST APIs for article generation, listing, and publishing
* Duplicate-publishing protection using article processing status

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* Google Gemini API
* Google Blogger API v3
* Google OAuth2
* node-cron
* dotenv

## Project Structure

```text
AI-Blogger-Automation/
│
├── src/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   └── Article.js
│   ├── services/
│   │   ├── aiService.js
│   │   ├── bloggerAuth.js
│   │   └── bloggerService.js
│   ├── jobs/
│   │   └── publishJob.js
│   ├── routes/
│   │   └── articleRoutes.js
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── credentials.json
└── README.md
```

> `credentials.json`, `.env`, and `token.json` contain sensitive information and must not be pushed to GitHub.

## Workflow

1. The application requests a new article from Gemini AI.
2. Existing article titles are provided to Gemini to reduce duplicate topics.
3. The generated article is saved in MongoDB with `PENDING` status.
4. The hourly cron job selects the oldest pending article.
5. The article status changes to `PROCESSING`.
6. The article is published to Blogger using the Blogger API.
7. After successful publishing, the MongoDB status changes to `PUBLISHED`.
8. If publishing fails, the retry count increases and the article returns to `PENDING`.
9. After three failed attempts, the article is marked as `FAILED`.

### Article Statuses

| Status       | Meaning                              |
| ------------ | ------------------------------------ |
| `PENDING`    | Article is waiting to be published   |
| `PROCESSING` | Article is currently being published |
| `PUBLISHED`  | Article was successfully published   |
| `FAILED`     | Article failed after three attempts  |

## Prerequisites

Install or prepare the following:

* Node.js and npm
* MongoDB or MongoDB Atlas
* Google Cloud project
* Gemini API key
* Blogger blog
* Google OAuth2 credentials

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yashdeepdeshmukh18/AI-Blogger-Automation.git
cd AI-Blogger-Automation
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure MongoDB

Start MongoDB locally or create a MongoDB Atlas database.

The default local database connection is:

```text
mongodb://127.0.0.1:27017/ai-blogger-automation
```

### 4. Create a Gemini API Key

1. Open Google AI Studio.
2. Generate a Gemini API key.
3. Keep the key private.
4. Add it to the `.env` file.

### 5. Configure Blogger API and OAuth2

1. Open Google Cloud Console.
2. Create or select a project.
3. Enable **Blogger API v3**.
4. Configure the OAuth consent screen.
5. Add your Google account as a test user if required.
6. Create an OAuth client of type **Web application**.
7. Add this redirect URI:

```text
http://localhost:5000/oauth2callback
```

8. Download the OAuth credentials file.
9. Rename it to:

```text
credentials.json
```

10. Place it in the project root directory.

### 6. Configure Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ai-blogger-automation
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
BLOGGER_BLOG_ID=YOUR_BLOGGER_BLOG_ID
```

Replace the placeholder values with your own credentials.

### 7. Authenticate with Google

Start the application:

```bash
npm start
```

Open:

```text
http://localhost:5000/auth/google
```

Complete Google authorization.

After successful authentication, the application creates a `token.json` file automatically.

### 8. Find the Blogger Blog ID

After authentication, open:

```text
http://localhost:5000/api/blogger/blogs
```

Copy the `id` of your Blogger blog and add it to:

```env
BLOGGER_BLOG_ID=YOUR_BLOGGER_BLOG_ID
```

Restart the application after updating the `.env` file.

## Running the Application

### Production Mode

```bash
npm start
```

### Development Mode

```bash
npm run dev
```

The server runs at:

```text
http://localhost:5000
```

## Scheduled Publishing

The application uses `node-cron` to automatically publish pending articles to Blogger.

### Production Schedule

The scheduler runs **once every hour** in the production configuration:

```js
cron.schedule("0 * * * *", publishPendingArticle);
```

### Testing Schedule

For local testing, the scheduler can temporarily be changed to run **every minute**:

```js
cron.schedule("* * * * *", publishPendingArticle);
```

This allows the complete publishing workflow to be tested without waiting for the hourly schedule.

After testing, restore the production schedule:

```js
cron.schedule("0 * * * *", publishPendingArticle);
```

> **Note:** The final submitted version should use the hourly production schedule.


## API Endpoints

| Method | Endpoint                    | Description                        |
| ------ | --------------------------- | ---------------------------------- |
| `GET`  | `/`                         | Check server status                |
| `GET`  | `/auth/google`              | Start Google OAuth2 authentication |
| `GET`  | `/oauth2callback`           | OAuth2 callback route              |
| `GET`  | `/api/blogger/blogs`        | Get available Blogger blogs        |
| `POST` | `/api/articles/generate`    | Generate and save a new AI article |
| `GET`  | `/api/articles`             | Get all stored articles            |
| `POST` | `/api/articles/:id/publish` | Manually publish an article        |

## Testing the Workflow

1. Start the application.
2. Complete Google authentication.
3. Generate an article using:

```http
POST /api/articles/generate
```

4. Confirm that the article is saved with `PENDING` status.
5. Wait for the hourly scheduler or manually publish the article.
6. Confirm that the status changes to `PROCESSING`.
7. Confirm that the article is published on Blogger.
8. Confirm that MongoDB status changes to `PUBLISHED`.

## Security

Do not commit these files:

```text
.env
credentials.json
token.json
node_modules/
```

Add them to `.gitignore`:

```gitignore
node_modules/
.env
credentials.json
token.json
```

## Author

**Yashdeep Deshmukh**

GitHub: https://github.com/yashdeepdeshmukh18/AI-Blogger-Automation.git
