import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js"
import auth from "./routes/auth.js"
import questions from "./routes/questions.js"
import attempts from "./routes/attempts.js"
import users from "./routes/users.js"

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", auth);
app.use("/api/questions", questions);
app.use("/api/attempts", attempts);
app.use("/api/users", users);

app.get("/", (req, res) => {
  res.send("Adaptive Learning API running");
});

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});