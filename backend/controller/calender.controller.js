// /backend/controllers/calendarController.js
import oauth2Client from "../config/googleClient.js";
import { google } from "googleapis";

// Redirects to Google's OAuth 2.0 consent screen
export const authUrl = (req, res) => {
  const scopes = ["https://www.googleapis.com/auth/calendar.readonly"];
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  console.log("Success");

  return res.redirect(url);
};

// Handles OAuth 2.0 callback and saves token
export const handleCallback = async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    // console.log("Success");

    return res.redirect(`/calendar?accessToken=${tokens.access_token}`);
  } catch (error) {
    return res.status(400).json({ error: "Error retrieving access token" });
  }
};

// Fetches the user's calendar events
export const getEvents = async (req, res) => {
  try {
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const events = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });
    console.log("Success");
    return res.json(events.data.items);
  } catch (error) {
    return res.status(400).json({ error: "Error fetching events" });
  }
};
