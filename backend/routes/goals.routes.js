import express from "express";
import {
  createGoal,
  deleteGoal,
  getGoals,
  updateGoal,
} from "../controller/goals.controller.js";
import protectRoute from "../middleware/protectRoute.js";
const router = express.Router();

router.post("/", protectRoute, createGoal);
router.get("/", protectRoute, getGoals);
router.put("/:id", protectRoute, updateGoal);
router.delete("/:id", protectRoute, deleteGoal);

export default router;
