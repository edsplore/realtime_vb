# Realtime Voice Bot

This project demonstrates a simple web application that connects to OpenAI's Realtime speech‑to‑speech API. The app serves a landing page where you can start and stop a conversation with a voice bot.

## Setup

1. Create a `.env` file with your OpenAI API key:

```
OPENAI_API_KEY=sk-...
```

2. Install dependencies (none are required beyond Node.js 18+ which provides `fetch`).

3. Start the server:

```
npm start
```

The server listens on port `3000` by default. Visit `http://localhost:3000` in your browser.

## Usage

Click **Start Chat** on the page to grant microphone access and begin speaking. The browser streams audio to OpenAI's Realtime API using a WebRTC connection. Responses from the model are played aloud.

Press **Stop Chat** to end the session.

## Notes

This demo relies on network access to OpenAI. Ensure outbound HTTPS traffic is allowed from your environment.
