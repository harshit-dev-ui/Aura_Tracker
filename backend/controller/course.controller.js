import Course from "../model/course.model.js";
import User from "../model/user.model.js";

// Helper function to update course progress
const updateCourseProgress = async (courseId) => {
  try {
    const course = await Course.findById(courseId);
    if (!course) return { success: false, message: 'Course not found' };

    let totalTopics = 0;
    let completedTopics = 0;

    course.modules.forEach((module) => {
      if (Array.isArray(module.topics)) { 
        module.topics.forEach((topic) => {
          totalTopics++;
          if (topic.completed) {
            completedTopics++;
          }
        });
      }
    });

    if (totalTopics === 0) {
      return { success: true, progress: 0, course };
    }

    const progress = (completedTopics / totalTopics) * 100;
    course.progress = progress;

    await course.save();
    return { success: true, progress, course };
  } catch (error) {
    console.error("Error updating course progress:", error);
    return { success: false, message: error.message };
  }
};


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

// Add a module to a course
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

    // Update the course progress
    const updateResult = await updateCourseProgress(courseId);
    if (!updateResult.success) {
      return res.status(500).json({ message: updateResult.message });
    }

    res.status(201).json({ message: 'Module added successfully', courseProgress: updateResult.progress });
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

    const module = course.modules.id(moduleId);
    if (!module) return res.status(404).json({ message: 'Module not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const previousModuleProgress = module.topics.filter(t => t.completed).length / module.topics.length * 100;

    const completedTopicsCount = module.topics.filter(t => t.completed).length;
    user.auraPoints -= completedTopicsCount * 10;

    if (previousModuleProgress === 100) {
      user.auraPoints -= 50;
    }

    await user.save();

    const moduleIndex = course.modules.findIndex(mod => mod._id.toString() === moduleId);
    if (moduleIndex !== -1) {
      course.modules.splice(moduleIndex, 1);
      await course.save();
    }

    // Update the course progress
    const updateResult = await updateCourseProgress(courseId);
    if (!updateResult.success) {
      return res.status(500).json({ message: updateResult.message });
    }

    res.json({ message: 'Module deleted successfully', courseProgress: updateResult.progress });
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

    const currentProgress = module.topics.filter(topic => topic.completed).length / module.topics.length * 100;

    if (currentProgress === 100) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      user.auraPoints -= 50;
      await user.save();
    }

    module.topics.push({ title });
    await course.save();

    // Update the course progress
    const updateResult = await updateCourseProgress(courseId);
    if (!updateResult.success) {
      return res.status(500).json({ message: updateResult.message });
    }

    res.status(201).json({ message: 'Topic added successfully', courseProgress: updateResult.progress });
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

    const topic = module.topics.id(topicId);
    if (!topic) return res.status(404).json({ message: 'Topic not found' });

    if (topic.completed) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      user.auraPoints -= 10;
      await user.save();
    }

    const topicIndex = module.topics.findIndex(t => t._id.toString() === topicId);
    if (topicIndex !== -1) {
      module.topics.splice(topicIndex, 1);
      await course.save();
    }

    const progress = module.topics.filter(t => t.completed).length / module.topics.length * 100;
    if (progress === 100) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      user.auraPoints += 50;
      await user.save();
    }

    // Update the course progress
    const updateResult = await updateCourseProgress(courseId);
    if (!updateResult.success) {
      return res.status(500).json({ message: updateResult.message });
    }

    res.json({ message: 'Topic deleted successfully', courseProgress: updateResult.progress });
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

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const previousProgress = module.topics.filter(t => t.completed).length / module.topics.length * 100;

    topic.completed = !topic.completed;

    if (topic.completed) {
      user.auraPoints += 10;
    } else {
      user.auraPoints -= 10;
    }

    const progress = module.topics.filter(t => t.completed).length / module.topics.length * 100;

    if (previousProgress === 100 && progress < 100) {
      user.auraPoints -= 50;
    }


    if (progress === 100 && previousProgress < 100) {
      user.auraPoints += 50;
    }

    await user.save();

    course.progress = (module.topics.filter(t => t.completed).length / module.topics.length) * 100;
    await course.save();  

    const updateResult = await updateCourseProgress(courseId);
    if (!updateResult.success) {
      return res.status(500).json({ message: updateResult.message });
    }

    res.json({
      message: 'Topic toggled successfully',
      userAuraPoints: user.auraPoints,
      courseProgress: updateResult.progress
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
