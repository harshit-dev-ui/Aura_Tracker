import express from "express";
import { getUsers,getAuraPoints, getLeaderboard } from "../controller/user.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getUsers);
router.get("/aura-points", protectRoute, getAuraPoints);
router.get("/leaderboard",getLeaderboard);
export default router;
