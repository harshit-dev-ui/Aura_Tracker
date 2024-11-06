import Course from "../model/course.model.js";
import User from "../model/user.model.js";

// Get all courses that the user is enrolled in
export const getCourses = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId).populate('enrolledCourse');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.enrolledCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific course by its ID
export const getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new course
export const createCourse = async (req, res) => {
  const { name, description, modules } = req.body;
  const userId = req.user._id;

  try {
    const course = new Course({
      name,
      description,
      modules,
      createdBy: userId,
    });

    const savedCourse = await course.save();
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.enrolledCourse.push(savedCourse._id);
    await user.save();

    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an existing course
export const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { name, description, modules } = req.body;
  const userId = req.user._id;

  try {
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    course.name = name || course.name;
    course.description = description || course.description;
    course.modules = modules || course.modules;

    await course.save();
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a course
export const deleteCourse = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    await User.updateMany(
      { enrolledCourse: id },
      { $pull: { enrolledCourse: id } }
    );

    await Course.findByIdAndDelete(id);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const addModule = async (req, res) => {
  const { courseId } = req.params;
  const { title } = req.body;
  const userId = req.user._id;

  try {
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

   
    const newModule = { title, topics: [] };
    course.modules.push(newModule);
    await course.save();

    res.status(201).json(course.modules[course.modules.length - 1]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Delete a module from a course
export const deleteModule = async (req, res) => {
  const { courseId, moduleId } = req.params;
  const userId = req.user._id;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    const moduleIndex = course.modules.findIndex(mod => mod._id.toString() === moduleId);
    if (moduleIndex === -1) return res.status(404).json({ message: 'Module not found' });

    course.modules.splice(moduleIndex, 1);
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a topic to a module
export const addTopic = async (req, res) => {
  const { courseId, moduleId } = req.params;
  const { title } = req.body;
  const userId = req.user._id;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    const module = course.modules.id(moduleId);
    if (!module) return res.status(404).json({ message: 'Module not found' });

    module.topics.push({ title });

    await course.save();
    
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a topic from a module
export const deleteTopic = async (req, res) => {
  const { courseId, moduleId, topicId } = req.params;
  const userId = req.user._id;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    const module = course.modules.id(moduleId);
    if (!module) return res.status(404).json({ message: 'Module not found' });

    const topicIndex = module.topics.findIndex(topic => topic._id.toString() === topicId);
    if (topicIndex === -1) return res.status(404).json({ message: 'Topic not found' });

    module.topics.splice(topicIndex, 1);
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark a topic as completed
export const completeTopic = async (req, res) => {
  const { courseId, moduleId, topicId } = req.params;
  const userId = req.user._id;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    const module = course.modules.id(moduleId);
    if (!module) return res.status(404).json({ message: 'Module not found' });

    const topic = module.topics.id(topicId);
    if (!topic) return res.status(404).json({ message: 'Topic not found' });

    topic.completed = !topic.completed;
    await course.save();
    res.json({ message: 'Topic toggled successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
