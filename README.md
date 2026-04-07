# CPSC 4900 Senior Project: Adaptly

Demo: [Insert Link]

## Overview


## Stack
Adaptly is implemented utilizing a MERN Stack: MongoDB, Express.js, React, and Node.js.

## Code Structure

```
CPSC-4900-Senior-Project/
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── Landing.jsx
│       │   ├── Login.jsx
│       │   ├── Quiz.jsx
│       │   ├── Register.jsx
│       │   └── EditProfile.jsx
├── server/
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
│   └── services/
│       ├── mastery.js
│       └── question.js

```

## API Routes

### Base URL
- Development: `http://localhost:5173`

### Authentication Routes