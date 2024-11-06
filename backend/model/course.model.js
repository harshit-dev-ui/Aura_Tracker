import mongoose from "mongoose";

const TopicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
}, { _id: true });

const ModuleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    topics: [TopicSchema],
}, { _id: true }); 

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  modules: [ModuleSchema], 
  progress: { type: Number, default: 0 },   
}, { timestamps: true });

const Course = mongoose.model('Course', CourseSchema);

export default Course;
