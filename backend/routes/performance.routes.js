import express from "express";
import { getTopPerformers } from "../controllers/performance.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/top", authMiddleware, getTopPerformers);

export default router;
