import express from "express";
import {
  createQuestion,
  getAllQuestions,
  deleteQuestionAndAnswers,
} from "../controller/question.controller.js";
import auth from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/", auth, createQuestion);
router.get("/", auth, getAllQuestions);
router.delete("/:questionId", deleteQuestionAndAnswers);

export default router;
