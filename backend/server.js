import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app=express();
const PORT=process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//api routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

mongoose.connect(process.env.MONGODB_URI)
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err));


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
