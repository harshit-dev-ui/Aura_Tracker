import express from "express";
import { login, signup, logout, googleAuth } from "../controller/auth.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);
router.post('/oAuth2', googleAuth);


router.get("/check-auth", protectRoute, (req, res) => {
  res.json({ authenticated: true, user: req.user });
});

export default router;
