import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";

import User from "../models/User.js";
import Attempt from "../models/Attempt.js";
import Question from "../models/Question.js";

dotenv.config();

const DB_NAME = "adaptive-learning";

