// /backend/routes/calendarRoutes.js
import express from "express";
import {
  authUrl,
  handleCallback,
  getEvents,
} from "../controller/calender.controller.js";

const router = express.Router();

router.get("/auth/google", authUrl); // Redirects to Google OAuth login
router.get("/auth/google/callback", handleCallback); // Handles Google’s OAuth callback
router.get("/events", getEvents);

export default router;
