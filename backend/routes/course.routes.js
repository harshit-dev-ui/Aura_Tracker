import express from 'express';
import {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    addTopic,
    deleteTopic,
    addModule,
    deleteModule,
    completeTopic
} from '../controller/course.controller.js';
import protectRoute from '../middleware/protectRoute.js';  

const router = express.Router();

// Apply middleware to the course routes
router.get('/', protectRoute, getCourses); 
router.get('/:id', protectRoute, getCourseById);
router.post('/', protectRoute, createCourse); 
router.put('/:id', protectRoute, updateCourse);  
router.delete('/:id', protectRoute, deleteCourse); 

// Module and topic routes
router.post('/:courseId/modules', protectRoute, addModule);  
router.delete('/:courseId/modules/:moduleId', protectRoute, deleteModule); 
router.post('/:courseId/modules/:moduleId/topics', protectRoute, addTopic);  
router.delete('/:courseId/modules/:moduleId/topics/:topicId', protectRoute, deleteTopic);
router.patch('/:courseId/modules/:moduleId/topics/:topicId/complete', protectRoute, completeTopic); 

export default router;
