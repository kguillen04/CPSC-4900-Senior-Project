import dotenv from "dotenv";
import mongoose from "mongoose";
import Question from "../models/Question.js";

dotenv.config();

const QUESTIONS = [
  // =========================
  // VARIABLES
  // =========================
  {
    concept: "variables",
    difficulty: 1,
    prompt: "What is a variable in programming?",
    choices: [
      "A named place that stores a value",
      "A command that repeats code",
      "A type of error",
      "A programming language",
    ],
    correctIndex: 0,
    explanation: "A variable is a named storage location for a value.",
    tags: ["basics", "definition"],
  },
  {
    concept: "variables",
    difficulty: 1,
    prompt: "Which line assigns the value 10 to the variable x?",
    choices: [
      "10 = x",
      "x == 10",
      "x = 10",
      "assign x 10",
    ],
    correctIndex: 2,
    explanation: "The assignment operator = stores the value 10 in x.",
    tags: ["assignment", "syntax"],
  },
  {
    concept: "variables",
    difficulty: 1,
    prompt: "What value is stored in x after this code runs?\n\nx = 7",
    choices: ["7", "x", "0", "Error"],
    correctIndex: 0,
    explanation: "The variable x is assigned the value 7.",
    tags: ["assignment", "basics"],
  },
  {
    concept: "variables",
    difficulty: 2,
    prompt: "What value is stored in x after this code runs?\n\nx = 5\nx = 8",
    choices: ["5", "8", "13", "Error"],
    correctIndex: 1,
    explanation: "The second assignment replaces the first, so x becomes 8.",
    tags: ["reassignment", "state"],
  },
  {
    concept: "variables",
    difficulty: 2,
    prompt: "What does this code print?\n\nx = 3\nprint(x)",
    choices: ["3", "x", "0", "Error"],
    correctIndex: 0,
    explanation: "print(x) outputs the value stored in x, which is 3.",
    tags: ["print", "values"],
  },
  {
    concept: "variables",
    difficulty: 2,
    prompt: "What value is stored in y after this code runs?\n\nx = 4\ny = x",
    choices: ["x", "y", "4", "Error"],
    correctIndex: 2,
    explanation: "y is assigned the current value of x, which is 4.",
    tags: ["assignment", "copying"],
  },
  {
    concept: "variables",
    difficulty: 3,
    prompt: "What does this code print?\n\nx = 6\nx = x + 2\nprint(x)",
    choices: ["6", "8", "2", "Error"],
    correctIndex: 1,
    explanation: "x starts as 6, then becomes 8 after adding 2.",
    tags: ["operations", "assignment"],
  },
  {
    concept: "variables",
    difficulty: 3,
    prompt: "What value is stored in total after this code runs?\n\na = 2\nb = 5\ntotal = a + b",
    choices: ["7", "25", "2", "5"],
    correctIndex: 0,
    explanation: "total is assigned the sum of a and b: 2 + 5 = 7.",
    tags: ["operations", "addition"],
  },
  {
    concept: "variables",
    difficulty: 3,
    prompt: "What does this code print?\n\nx = 10\ny = x\nprint(y)",
    choices: ["10", "y", "x", "Error"],
    correctIndex: 0,
    explanation: "y stores the value of x, which is 10.",
    tags: ["copying", "values"],
  },
  {
    concept: "variables",
    difficulty: 4,
    prompt: "What does this code print?\n\nx = 4\ny = 2\nx = x * y\nprint(x)",
    choices: ["6", "8", "4", "2"],
    correctIndex: 1,
    explanation: "x becomes 4 * 2, which is 8.",
    tags: ["operations", "multiplication"],
  },
  {
    concept: "variables",
    difficulty: 4,
    prompt: "What value is stored in z after this code runs?\n\nx = 3\ny = x + 4\nz = y - 2",
    choices: ["3", "5", "7", "1"],
    correctIndex: 1,
    explanation: "y becomes 7, then z becomes 7 - 2 = 5.",
    tags: ["multi-step", "tracing"],
  },
  {
    concept: "variables",
    difficulty: 4,
    prompt: "What does this code print?\n\nscore = 12\nbonus = 3\nscore = score + bonus\nprint(score)",
    choices: ["12", "3", "15", "Error"],
    correctIndex: 2,
    explanation: "score is updated to 12 + 3, so it becomes 15.",
    tags: ["reassignment", "addition"],
  },
  {
    concept: "variables",
    difficulty: 5,
    prompt: "What does this code print?\n\nx = 5\ny = x\nx = 7\nprint(y)",
    choices: ["7", "5", "0", "Error"],
    correctIndex: 1,
    explanation: "y got the value 5 when it was assigned, so changing x later does not change y.",
    tags: ["copying", "state"],
  },
  {
    concept: "variables",
    difficulty: 5,
    prompt: "What does this code print?\n\na = 2\nb = a\na = a + 3\nprint(b)",
    choices: ["2", "3", "5", "Error"],
    correctIndex: 0,
    explanation: "b was assigned the original value of a, which was 2.",
    tags: ["copying", "reassignment"],
  },
  {
    concept: "variables",
    difficulty: 5,
    prompt: "What value is stored in x after this code runs?\n\nx = 1\nx = x + 2\nx = x * 3",
    choices: ["3", "6", "9", "1"],
    correctIndex: 2,
    explanation: "x becomes 3 after x + 2, then 9 after multiplying by 3.",
    tags: ["multi-step", "operations"],
  },

  // =========================
  // LOOPS
  // =========================
  {
    concept: "loops",
    difficulty: 1,
    prompt: "What is a loop in programming?",
    choices: [
      "A way to repeat code",
      "A place to store data",
      "A type of comparison",
      "A syntax error",
    ],
    correctIndex: 0,
    explanation: "A loop repeats a block of code multiple times.",
    tags: ["basics", "definition"],
  },
  {
    concept: "loops",
    difficulty: 1,
    prompt: "How many times will this loop run?\n\nfor i in range(2):\n  print(i)",
    choices: ["1", "2", "3", "0"],
    correctIndex: 1,
    explanation: "range(2) gives 0 and 1, so the loop runs 2 times.",
    tags: ["for-loop", "range"],
  },
  {
    concept: "loops",
    difficulty: 1,
    prompt: "What does this code print?\n\nfor i in range(3):\n  print(i)",
    choices: ["0 1 2", "1 2 3", "0 1 2 3", "3"],
    correctIndex: 0,
    explanation: "range(3) produces 0, 1, and 2.",
    tags: ["output", "range"],
  },
  {
    concept: "loops",
    difficulty: 2,
    prompt: "How many times will this loop run?\n\nfor i in range(1, 4):\n  print(i)",
    choices: ["2", "3", "4", "5"],
    correctIndex: 1,
    explanation: "range(1, 4) includes 1, 2, and 3, so it runs 3 times.",
    tags: ["range", "counting"],
  },
  {
    concept: "loops",
    difficulty: 2,
    prompt: "What does this code print?\n\nfor i in range(1, 4):\n  print(i)",
    choices: ["1 2 3", "0 1 2 3", "1 2 3 4", "4"],
    correctIndex: 0,
    explanation: "The loop prints 1, then 2, then 3.",
    tags: ["output", "range"],
  },
  {
    concept: "loops",
    difficulty: 2,
    prompt: "What is the value of i the first time this loop runs?\n\nfor i in range(4):\n  print(i)",
    choices: ["0", "1", "4", "It has no value"],
    correctIndex: 0,
    explanation: "range(4) starts at 0.",
    tags: ["loop-variable", "range"],
  },
  {
    concept: "loops",
    difficulty: 3,
    prompt: "What is the final value of x?\n\nx = 0\nfor i in range(3):\n  x = x + 1",
    choices: ["1", "2", "3", "0"],
    correctIndex: 2,
    explanation: "The loop runs 3 times, adding 1 each time, so x becomes 3.",
    tags: ["accumulation", "state"],
  },
  {
    concept: "loops",
    difficulty: 3,
    prompt: "What does this code print?\n\nx = 2\nfor i in range(2):\n  print(x)",
    choices: ["2 2", "0 1", "2", "4"],
    correctIndex: 0,
    explanation: "The loop runs twice, and x stays 2 both times.",
    tags: ["output", "repetition"],
  },
  {
    concept: "loops",
    difficulty: 3,
    prompt: "What is the final value of total?\n\ntotal = 1\nfor i in range(4):\n  total = total + 2",
    choices: ["5", "6", "8", "9"],
    correctIndex: 3,
    explanation: "Starting at 1, adding 2 four times gives 9.",
    tags: ["accumulation", "tracing"],
  },
  {
    concept: "loops",
    difficulty: 4,
    prompt: "What does this code print?\n\nx = 1\nfor i in range(3):\n  x = x * 2\nprint(x)",
    choices: ["6", "8", "4", "2"],
    correctIndex: 1,
    explanation: "x doubles three times: 1 → 2 → 4 → 8.",
    tags: ["multiplication", "iteration"],
  },
  {
    concept: "loops",
    difficulty: 4,
    prompt: "What is the final value of sum?\n\nsum = 0\nfor i in range(1, 4):\n  sum = sum + i",
    choices: ["3", "6", "7", "4"],
    correctIndex: 1,
    explanation: "sum becomes 0 + 1 + 2 + 3 = 6.",
    tags: ["summation", "range"],
  },
  {
    concept: "loops",
    difficulty: 4,
    prompt: "What does this code print?\n\nfor i in range(2):\n  print(i + 1)",
    choices: ["0 1", "1 2", "2 3", "1 2 3"],
    correctIndex: 1,
    explanation: "i takes values 0 and 1, so i + 1 prints 1 and 2.",
    tags: ["output", "expressions"],
  },
  {
    concept: "loops",
    difficulty: 5,
    prompt: "What is the final value of x?\n\nx = 5\nfor i in range(3):\n  x = x - 1",
    choices: ["2", "3", "4", "5"],
    correctIndex: 0,
    explanation: "x decreases by 1 three times: 5 → 4 → 3 → 2.",
    tags: ["decrement", "state"],
  },
  {
    concept: "loops",
    difficulty: 5,
    prompt: "What does this code print?\n\nx = 0\nfor i in range(3):\n  x = x + i\nprint(x)",
    choices: ["3", "6", "2", "0"],
    correctIndex: 0,
    explanation: "x becomes 0 + 0 + 1 + 2 = 3.",
    tags: ["accumulation", "loop-variable"],
  },
  {
    concept: "loops",
    difficulty: 5,
    prompt: "How many numbers does this code print?\n\nfor i in range(2, 6):\n  print(i)",
    choices: ["3", "4", "5", "6"],
    correctIndex: 1,
    explanation: "range(2, 6) includes 2, 3, 4, and 5, so it prints 4 numbers.",
    tags: ["range", "counting"],
  },

  // =========================
  // CONDITIONALS
  // =========================
  {
    concept: "conditionals",
    difficulty: 1,
    prompt: "What is a conditional statement?",
    choices: [
      "Code that makes a decision based on a condition",
      "Code that always repeats",
      "A variable name",
      "A print statement",
    ],
    correctIndex: 0,
    explanation: "Conditionals let programs choose what to do depending on whether something is true or false.",
    tags: ["basics", "definition"],
  },
  {
    concept: "conditionals",
    difficulty: 1,
    prompt: "What does an if statement do?",
    choices: [
      "Runs code only when a condition is true",
      "Stores a value in a variable",
      "Repeats code forever",
      "Creates a new function",
    ],
    correctIndex: 0,
    explanation: "An if statement checks a condition and runs code if that condition is true.",
    tags: ["if", "basics"],
  },
  {
    concept: "conditionals",
    difficulty: 1,
    prompt: "What does this code print?\n\nx = 5\nif x > 3:\n  print('Yes')",
    choices: ["Yes", "No", "Error", "Nothing"],
    correctIndex: 0,
    explanation: "Because 5 is greater than 3, the condition is true and 'Yes' prints.",
    tags: ["if", "comparison"],
  },
  {
    concept: "conditionals",
    difficulty: 2,
    prompt: "What does this code print?\n\nx = 2\nif x > 3:\n  print('Yes')",
    choices: ["Yes", "No", "Error", "Nothing"],
    correctIndex: 3,
    explanation: "Since 2 is not greater than 3, the if block does not run and nothing is printed.",
    tags: ["if", "false-case"],
  },
  {
    concept: "conditionals",
    difficulty: 2,
    prompt: "What does this code print?\n\nx = 4\nif x == 4:\n  print('Match')",
    choices: ["Match", "No Match", "4", "Nothing"],
    correctIndex: 0,
    explanation: "The condition x == 4 is true, so 'Match' is printed.",
    tags: ["comparison", "equality"],
  },
  {
    concept: "conditionals",
    difficulty: 2,
    prompt: "What does this code print?\n\nx = 2\nif x > 3:\n  print('A')\nelse:\n  print('B')",
    choices: ["A", "B", "Error", "Nothing"],
    correctIndex: 1,
    explanation: "The condition is false, so the else block runs and prints 'B'.",
    tags: ["if-else", "branching"],
  },
  {
    concept: "conditionals",
    difficulty: 3,
    prompt: "What does this code print?\n\nx = 7\nif x < 10:\n  print('Small')\nelse:\n  print('Big')",
    choices: ["Small", "Big", "7", "Nothing"],
    correctIndex: 0,
    explanation: "Since 7 is less than 10, the if branch runs.",
    tags: ["if-else", "comparison"],
  },
  {
    concept: "conditionals",
    difficulty: 3,
    prompt: "What does this code print?\n\nx = 5\nif x != 5:\n  print('A')\nelse:\n  print('B')",
    choices: ["A", "B", "5", "Nothing"],
    correctIndex: 1,
    explanation: "x != 5 is false because x is 5, so the else branch prints 'B'.",
    tags: ["inequality", "branching"],
  },
  {
    concept: "conditionals",
    difficulty: 3,
    prompt: "What does this code print?\n\nx = 8\nif x >= 8:\n  print('Pass')",
    choices: ["Pass", "Fail", "8", "Nothing"],
    correctIndex: 0,
    explanation: "Because x is equal to 8, the condition x >= 8 is true.",
    tags: ["comparison", "greater-than-equal"],
  },
  {
    concept: "conditionals",
    difficulty: 4,
    prompt: "What does this code print?\n\nx = 7\nif x > 5:\n  if x < 10:\n    print('Yes')",
    choices: ["Yes", "No", "Error", "Nothing"],
    correctIndex: 0,
    explanation: "Both conditions are true, so the nested print statement runs.",
    tags: ["nested", "logic"],
  },
  {
    concept: "conditionals",
    difficulty: 4,
    prompt: "What does this code print?\n\nx = 11\nif x > 5:\n  if x < 10:\n    print('Yes')\n  else:\n    print('No')",
    choices: ["Yes", "No", "11", "Nothing"],
    correctIndex: 1,
    explanation: "The first condition is true, but x < 10 is false, so the nested else prints 'No'.",
    tags: ["nested", "if-else"],
  },
  {
    concept: "conditionals",
    difficulty: 4,
    prompt: "What does this code print?\n\nx = 3\nif x % 2 == 0:\n  print('Even')\nelse:\n  print('Odd')",
    choices: ["Even", "Odd", "3", "Nothing"],
    correctIndex: 1,
    explanation: "3 is not divisible by 2, so the else branch prints 'Odd'.",
    tags: ["modulo", "parity"],
  },
  {
    concept: "conditionals",
    difficulty: 5,
    prompt: "What does this code print?\n\nx = 4\ny = 6\nif x < y:\n  print(x)\nelse:\n  print(y)",
    choices: ["4", "6", "x", "y"],
    correctIndex: 0,
    explanation: "Since x is less than y, the program prints x, which is 4.",
    tags: ["comparison", "variables"],
  },
  {
    concept: "conditionals",
    difficulty: 5,
    prompt: "What does this code print?\n\nx = 9\nif x > 5:\n  print('A')\nif x > 8:\n  print('B')",
    choices: ["A", "B", "A B", "Nothing"],
    correctIndex: 2,
    explanation: "Both if conditions are true, so both print statements run.",
    tags: ["multiple-if", "logic"],
  },
  {
    concept: "conditionals",
    difficulty: 5,
    prompt: "What does this code print?\n\nx = 4\nif x % 2 == 0:\n  if x > 2:\n    print('Good')\n  else:\n    print('Bad')",
    choices: ["Good", "Bad", "4", "Nothing"],
    correctIndex: 0,
    explanation: "x is even, and x is greater than 2, so the nested condition prints 'Good'.",
    tags: ["nested", "modulo", "logic"],
  },
];

function validateQuestions(questions) {
  questions.forEach((q, i) => {
    if (!q.concept || !q.prompt || !Array.isArray(q.choices)) {
      throw new Error(`Question ${i} is missing required fields.`);
    }

    if (q.choices.length !== 4) {
      throw new Error(`Question ${i} must have exactly 4 choices.`);
    }

    if (
      typeof q.correctIndex !== "number" ||
      q.correctIndex < 0 ||
      q.correctIndex >= q.choices.length
    ) {
      throw new Error(`Question ${i} has an invalid correctIndex.`);
    }

    if (q.difficulty < 1 || q.difficulty > 5) {
      throw new Error(`Question ${i} has invalid difficulty ${q.difficulty}.`);
    }
  });
}

async function seed() {
  const uri = process.env.ATLAS_URI;

  try {
    validateQuestions(QUESTIONS);

    await mongoose.connect(uri, { dbName: "adaptive-learning" });
    console.log("Connected to MongoDB");

    const deleteResult = await Question.deleteMany({
      concept: { $in: ["variables", "loops", "conditionals"] },
    });
    console.log(`Deleted ${deleteResult.deletedCount} existing questions`);

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