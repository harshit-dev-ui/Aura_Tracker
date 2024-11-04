import bcrypt from 'bcryptjs';
import User from "..model/user.model.js";
import generateTokenAndSetCookie from '../utils/generateToken.js'; 

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json({ msg: 'Email is required' });
        }
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
        });
    } catch (error) {
        res.status(500).json({ msg: 'Server Error' });
    }
};

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        let user = await User.findOne({ $or: [{ username }, { email }] });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = await User.create({ 
            username, 
            email,
            password: await bcrypt.hash(password, 10),
        });

        generateTokenAndSetCookie(user._id, res);

        if (user) {
            generateTokenAndSetCookie(newUser._id, res);
            await user.save();

            res.status(201).json({
                _id: user._id,
                username: user.username,
                email : user.email,
            });
        } else {
            res.status(400).json({ error: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ msg: 'Server Error' });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ msg: 'Server Error' });
    }
};
