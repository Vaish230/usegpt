# UseGPT

A full-stack AI chat application inspired by ChatGPT, built with React, Node.js, Express, MongoDB, and Groq AI.

## Features

* AI-powered conversations using Groq API
* Persistent chat history
* Thread-based conversation management
* Create, switch, and delete chat threads
* Markdown rendering for AI responses
* Syntax-highlighted code blocks
* Typing animation effect
* Modern dark-themed UI
* MongoDB database integration
* User authentication structure ready for expansion

## Tech Stack

### Frontend

* React
* Vite
* Context API
* React Markdown
* Rehype Highlight
* React Spinners
* Font Awesome

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Groq API

## Project Structure

```text
usegpt/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
└── README.md
```

## Installation

### Clone Repository

```bash
git clone https://github.com/Vaish230/usegpt.git
cd usegpt
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGO_DB=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_secret_key
```

Start backend server:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Chat

```http
POST /api/chat
```

Request:

```json
{
  "threadId": "thread-id",
  "message": "Hello"
}
```

### Threads

```http
GET /api/thread
```

Returns all chat threads.

```http
GET /api/thread/:threadId
```

Returns a specific thread.

```http
DELETE /api/thread/:threadId
```

Deletes a thread.

## Screenshots

Add screenshots of your application here.

## Future Improvements

* User authentication
* Multiple AI model support
* Chat search
* File uploads
* Conversation sharing
* Real-time streaming responses
* Theme customization
* Cloud deployment

## Author

Vaishnavi Awate

---

Built with ❤️ using React, Express, MongoDB, and Groq AI.
