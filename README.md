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
- Development: `http://localhost:5357/api`

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

## Adaptive Learning Algorithm

Adaptly maintains a mastery score for each concept, where:

- Mastery ∈ [0, 1]
- Initial mastery = 0.5

After each question, mastery is updated using:

\[
M_{new} = M_{old} + \alpha (T - M_{old})
\]

Where:
- \( \alpha = 0.15 \) (learning rate)
- \( T \) = target score based on difficulty and correctness

### Key Design Principles
- Correct answers increase mastery more at higher difficulty levels  
- Incorrect answers penalize mastery more at lower difficulty levels  
- Difficulty is selected based on current mastery with slight randomness  

## Evaluation

The system is evaluated using simulated learners with different ability profiles:

- Struggling learner  
- Improving learner  
- Strong learner  

### Baselines
- Random difficulty selection  
- Fixed difficulty selection  

Metrics analyzed:
- Mastery progression over time  
- Accuracy  
- Difficulty distribution  

Evaluation results are generated via:
- `evaluateAdaptiveAlgorithm.js`
- Jupyter notebooks in `/scripts`

## Running the Project

### 1. Clone the repository
```bash
git clone https://github.com/kguillen04/CPSC-4900-Senior-Project.git
cd CPSC-4900-Senior-Project
```

### 2. Install dependencies
```bash
cd server
npm install

cd ../client
npm install
```

### 3. Set up environment variables
Create a `.env` file in `/server`:
```bash
ATLAS_URI=mongodb+srv://kevinguillen_db_user:B-Widow12!@database-cluster.jyqvoek.mongodb.net/
```

Create a `.env` file in `/client`:
```bash
VITE_API_BASE=http://localhost:5050
```

### 4. Seed the database
```bash
cd server
node scripts/seedQuestions.js
```

### 5. Run the backend
```bash
cd server
npm run dev
```

### 6. Run the frontend
```bash
cd client
npm run dev
```

## Future Work
- More advanced mastery modeling (e.g., Bayesian Knowledge Tracing)
- Expanded question bank across additional CS topics
- Improved UI/UX and analytics dashboard
- Real user study for empirical validation

## Acknowledgements
Developed as part of CPSC 4900 (Senior Project) at Yale University.