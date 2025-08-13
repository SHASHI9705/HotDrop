import express, { Router } from "express";
import { createFeedback } from "../controllers/feedbackController.js";

const router: Router = express.Router();

router.post("/feedback", createFeedback as any);

export default router;
