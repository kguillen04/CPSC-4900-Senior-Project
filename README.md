# CPSC 4900 Senior Project: Adaptly

## Author
Kevin Guillen, Yale Class of 2026

<img width="1433" height="663" alt="Screenshot 2026-04-09 at 6 31 54 PM" src="https://github.com/user-attachments/assets/3bf15515-a470-4564-89b5-c24416e25cdf" />


Demo: [Insert Link]

## Overview
Adaptly is an adaptive learning platform designed for introductory computer science education. The system dynamically adjusts question difficulty based on a user's mastery of core concepts such as variables, conditionals, and loops.

Unlike traditional one-size-fits-all learning systems, Adaptly personalizes the learning experience in real time by updating a user’s mastery score after each question and selecting subsequent questions accordingly.

The project includes:
- A full-stack web application for user interaction
- A mastery-based adaptive learning algorithm
- A simulation framework for evaluating adaptive vs. random difficulty selection

## Stack
Adaptly is implemented using the **MERN stack**:

- **MongoDB Atlas** – Database for users, questions, and attempts  
- **Express.js** – Backend API  
- **React (Vite)** – Frontend UI  
- **Node.js** – Server runtime  

Additional tools:
- Mongoose (ODM)
- dotenv (environment configuration)
- Tailwind CSS (styling)

## Code Structure
The codebase can be  divided into two parts based on the folders: client (frontend) and server (backend). A diagram of the relevant parts of the codebase is shown below.

```
CPSC-4900-Senior-Project/
├── client/
│   ├── App.jsx
│   ├── main.jsx
│   ├── api.js
│   ├── public/
│   │   ├── favicon.svg
│   └── src/
│       ├── assets/
│       │   ├── adaptly_logo.png
│       ├── components/
│       │   ├── Navbar.jsx
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── Landing.jsx
│       │   ├── Login.jsx
│       │   ├── Quiz.jsx
│       │   ├── QuizSummary.jsx
│       │   ├── Register.jsx
│       │   └── EditProfile.jsx
├── server/
│   ├── server.js
│   ├── models/
│   │   ├── Attempt.js
│   │   ├── Question.js
│   │   ├── User.js
│   ├── routes/
│   │   ├── attempts.js
│   │   ├── auth.js
│   │   ├── questions.js
│   │   ├── users.js
│   ├── scripts/
│   │   ├── seedQuestions.js
│   |   ├── evaluateAdaptiveAlgorithm.js
│   |   ├── adaptive_eval.ipynb
│   |   ├── adaptive_evaluation_analysis.ipynb
│   └── services/
│       ├── mastery.js
│       └── question.js

```

## API Routes

### Base URL
- Development: `http://localhost:3000/api`
- Health Check: `GET /health` (if implemented)

---

### Authentication Routes (`/api/auth`)

- **POST `/api/auth/register`** - Register a new user  
  - Body: `firstName`, `lastName`, `email`, `password`
- **POST `/api/auth/login`** - Authenticate user and return user data  
  - Body: `email`, `password`

---

### User Routes (`/api/users`)

- **POST `/api/users/:userId/profile`** - Update user profile  
  - Body: `firstName`, `lastName`, `bio`
  - Returns updated user information
- **GET `/api/users/:userId/mastery`**
  - Body: None
  - Returns user mastery scores

---

### Question Routes (`/api/questions`)

- **GET `/api/questions/next`** - Fetch next question for a given concept  
  - Query params: `userId`, `concept`
  - Uses adaptive or random difficulty selection internally  
  - Returns:
    - `question` (prompt + choices)
    - `difficulty`
    - `targetDifficulty`

---

### Attempt Routes (`/api/attempts`)

- **POST `/api/attempts`** - Submit an answer and update mastery  
  - Body:
    - `userId`
    - `questionId`
    - `selectedIndex`
    - `responseTimeMs` (optional)
  - Returns:
    - `correct` (boolean)
    - `correctIndex`
    - `explanation`
    - `masteryUpdate`
    - `updatedMastery`
    - `attemptId`

---
