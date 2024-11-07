import bcrypt from "bcryptjs";
import User from "../model/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      auraPoints: user.auraPoints,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    let user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = new User({
      username,
      email,
      password: await bcrypt.hash(password, 10),
    });

    await user.save();
    console.log(user);

    generateTokenAndSetCookie(user._id, res);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      auraPoints: user.auraPoints,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

export const googleAuth = async (req, res) => {
  const { tokenId } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, sub } = ticket.getPayload();
    let user = await User.findOne({ googleId: sub });

    if (user) {
      generateTokenAndSetCookie(user._id, res);

      return res.status(200).json({
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          auraPoints: user.auraPoints,
        },
      });
    } else {
      user = await User.create({
        googleId: sub,
        username: name,
        email,
        password: undefined,
      });

      generateTokenAndSetCookie(user._id, res);

      return res.status(200).json({
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          auraPoints: user.auraPoints,
        },
      });
    }
  } catch (err) {
    console.error("Google Authentication Error:", err);
    res.status(500).json({ msg: "Server error during Google Authentication" });
  }
};
