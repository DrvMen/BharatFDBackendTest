# FAQ Backend (Node.js + Express + Redis)

## 🚀 Overview
This project is a backend service for managing Frequently Asked Questions (FAQs) with multilingual support. Built using **Node.js**, **Express.js**, and **Redis**, it allows users to fetch, add, and manage FAQs efficiently.

## 📌 Features
- CRUD operations for FAQs
- Multilingual support (Auto-translate via Google Translate API)
- WYSIWYG editor integration for rich text answers
- Caching with Redis for faster responses
- RESTful API with query parameter-based language selection
- Docker support for easy deployment

---

## 🛠 Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Caching**: Redis
- **Translation**: Google Translate API
- **Deployment**: Docker

---

## 📥 Installation & Setup

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/yourusername/faq-backend.git
cd faq-backend
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Set Up Environment Variables**
Create a `.env` file in the root directory:
```ini
PORT=8000
MONGO_URI=mongodb://localhost:27017/faqdb
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
GOOGLE_TRANSLATE_API_KEY=your_api_key_here
```

### **4️⃣ Start Redis (If not running)**
#### **Option 1: Run Redis Locally**
```sh
redis-server
```
#### **Option 2: Run Redis in Docker**
```sh
docker run --name redis-server -p 6379:6379 -d redis
```

### **5️⃣ Start the Server**
```sh
npm start
```
Server should now be running on `http://localhost:8000`

---

## 📡 API Endpoints

### **Fetch All FAQs**
```sh
GET /api/faqs/
```
**Example Response:**
```json
[
  {
    "id": "1",
    "question": "What is Node.js?",
    "answer": "Node.js is a JavaScript runtime...",
    "language": "en"
  }
]
```

### **Fetch FAQs in Specific Language**
```sh
GET /api/faqs/?lang=hi
```
**Example Response (Hindi)**:
```json
[
  {
    "id": "1",
    "question": "Node.js क्या है?",
    "answer": "Node.js एक जावास्क्रिप्ट रनटाइम है...",
    "language": "hi"
  }
]
```

### **Add New FAQ**
```sh
POST /api/faqs/
Content-Type: application/json
```
**Request Body:**
```json
{
  "question": "What is Express.js?",
  "answer": "Express.js is a web framework for Node.js."
}
```
**Response:**
```json
{
  "message": "FAQ added successfully!",
  "faq": {
    "id": "2",
    "question": "What is Express.js?",
    "answer": "Express.js is a web framework for Node.js.",
    "language": "en"
  }
}
```

### **Delete an FAQ**
```sh
DELETE /api/faqs/:id
```

---

## 🐳 Docker Setup

### **Build and Run the Docker Container**
```sh
docker build -t faq-backend .
docker run -p 8000:8000 faq-backend
```

---

## ✅ Testing
### **Run Tests with Jest**
```sh
npm test
```

---

## 📜 Coding Standards & Best Practices
- Follow **ESLint** and **Prettier** for clean code.
- Use meaningful **Git commit messages**:
  ```sh
  feat: Add Redis caching for FAQs
  fix: Resolve API timeout issue
  docs: Update README with Docker setup
  ```
- Use **environment variables** for sensitive data.

---

## 🛠 Contribution Guidelines
1. Fork the repository.
2. Create a new branch:
   ```sh
   git checkout -b feature-new-api
   ```
3. Make your changes and commit:
   ```sh
   git commit -m "feat: Added new API endpoint"
   ```
4. Push the branch:
   ```sh
   git push origin feature-new-api
   ```
5. Open a **Pull Request** for review.

---


