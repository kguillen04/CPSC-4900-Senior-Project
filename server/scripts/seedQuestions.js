import dotenv from "dotenv";
import mongoose from "mongoose";
import Question from "../models/Question.js"

dotenv.config();

const QUESTIONS = [
  {
    concept: "variables",
    difficulty: 1,
    prompt: "What is a variable in programming?",
    choices: [
      "A container that stores a value",
      "A loop that repeats code",
      "A function that runs automatically",
      "A type of programming language",
    ],
    correctIndex: 0,
    explanation: "A variable is a named container used to store data values.",
    tags: ["basics", "definition"],
  },
  {
    concept: "variables",
    difficulty: 2,
    prompt: "What value is stored in x after this code runs?\n\nx = 5\nx = x + 3",
    choices: ["5", "8", "3", "53"],
    correctIndex: 1,
    explanation: "x starts as 5 and then becomes 5 + 3, which is 8.",
    tags: ["assignment", "basics"],
  },
  {
    concept: "variables",
    difficulty: 3,
    prompt: "What does this code print?\n\nx = 10\ny = x\nprint(y)",
    choices: ["10", "y", "x", "Error"],
    correctIndex: 0,
    explanation: "y is assigned the value of x, which is 10.",
    tags: ["assignment", "values"],
  },
  {
    concept: "variables",
    difficulty: 4,
    prompt: "What does this code print?\n\nx = 4\ny = 2\nx = x * y\nprint(x)",
    choices: ["6", "8", "4", "2"],
    correctIndex: 1,
    explanation: "x becomes 4 * 2, which equals 8.",
    tags: ["operations", "assignment"],
  },
  {
    concept: "variables",
    difficulty: 5,
    prompt: "What does this code print?\n\nx = 5\ny = x\nx = 7\nprint(y)",
    choices: ["7", "5", "0", "Error"],
    correctIndex: 1,
    explanation:
      "y was assigned the value of x when x was 5, so it keeps that value even after x changes.",
    tags: ["references", "assignment"],
  },
];

async function seed() {
    const uri = process.env.ATLAS_URI;

    try {
        // Connect
        await mongoose.connect(uri, { dbName: "adaptive-learning" });
        console.log("Connected to MongoDB");

        // Optional: avoid duplicates by clearing the variables questions first
        const deleteResult = await Question.deleteMany({ concept: "variables" });
        console.log(`Deleted ${deleteResult.deletedCount} existing variables questions`);

        // Insert
        const insertResult = await Question.insertMany(QUESTIONS, { ordered: true });
        console.log(`Inserted ${insertResult.length} questions`);

    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected");
    }
}

seed();