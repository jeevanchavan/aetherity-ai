# 🚀 Aetherity – AI-Powered Search Assistant

Aetherity is a modern AI-powered search assistant designed to help users discover information through natural conversations. Inspired by the usability of modern AI products, Aetherity combines intelligent responses with a clean, responsive interface built for productivity.

---
Live Link :
https://aetherity-ai.onrender.com/

## ✨ Features

### 🤖 AI-Powered Responses

* Generate intelligent answers using Google's Gemini API.
* Supports conversational interactions.
* Context-aware responses.

### 💬 Chat Management

* Create new conversations.
* View chat history grouped by date.
* Delete individual chats.
* Continue previous conversations seamlessly.

### 🔐 Authentication

* User registration and login.
* JWT-based authentication using HTTP-only cookies.
* Secure logout functionality.

### 🎨 Modern User Interface

* Clean and responsive dashboard.
* Dark mode support.
* Premium AI-inspired design.
* Optimized for desktop and mobile devices.

### 📝 Rich Markdown Rendering

* Proper markdown rendering using React Markdown.
* Supports:

  * Headings
  * Lists
  * Links
  * Tables
  * Code blocks
  * Inline code formatting
* Syntax highlighting for code snippets.

### ⚡ Enhanced User Experience

* Fixed input bar for continuous interaction.
* Loading states for AI responses.
* Empty state suggestions.
* Smooth transitions and micro-interactions.

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Axios
* React Markdown
* Remark GFM

### Backend

* Node.js
* Express.js
* JWT Authentication
* Cookie Parser
* Nodemailer

### Database

* MongoDB
* Mongoose

### AI Integration

* Google Gemini API

---

## 📸 Screenshots

### Login Page

> Add a screenshot here.

### Dashboard

> Add a screenshot here.

---

## 🚀 Live Demo

🌐 https://aetherity-ai.onrender.com/

---

## 📂 Project Structure

```text
Aetherity/
├── frontend/
│   ├── src/
│   ├── public/
│   └── ...
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── ...
│
└── README.md
```

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/aetherity.git
cd aetherity
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

---

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file:

```env
PORT=3000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key

EMAIL_USER=your_email

EMAIL_PASS=your_email_password

FRONTEND_URL=http://localhost:5173
```

---

## 🔒 Environment Variables

### Frontend

```env
VITE_API_URL=
```

### Backend

```env
PORT=
MONGO_URI=
JWT_SECRET=
GEMINI_API_KEY=
EMAIL_USER=
EMAIL_PASS=
FRONTEND_URL=
```

---

## 📌 Future Improvements

* [ ] Export conversations.
* [ ] Share chat links.
* [ ] Voice input support.
* [ ] AI-generated follow-up suggestions.
* [ ] Search citations and sources.
* [ ] PWA support.
* [ ] Multi-model AI selection.

---


## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Jeevan Chavan**

* GitHub: https://github.com/your-github-username
* LinkedIn: https://linkedin.com/in/your-linkedin-profile

---

### ⭐ If you found this project helpful, consider giving it a star!
