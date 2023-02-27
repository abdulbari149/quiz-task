import { Router } from "express";
import * as quizController from "../controllers/quiz.controller";


const router = Router();
// we can validate usi
router.post("/", quizController.createQuiz);
router.get("/:id", quizController.getQuizDetails)

export default router;
