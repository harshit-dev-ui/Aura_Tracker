import axios from 'axios';

const API_URL = 'http://localhost:5000/api/courses';

const config = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
};

const handleRequest = async (request) => {
  try {
    const response = await request();
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error.response ? error.response.data : error;
  }
};

export const getCourses = async () => {
  return handleRequest(() => axios.get(`${API_URL}`, config));
};

export const getCourseById = async (id) => {
  return handleRequest(() => axios.get(`${API_URL}/${id}`, config));
};

export const createCourse = async (courseData) => {
  return handleRequest(() => axios.post(`${API_URL}`, courseData, config));
};

export const updateCourse = async (id, courseData) => {
  return handleRequest(() => axios.put(`${API_URL}/${id}`, courseData, config));
};

export const deleteCourse = async (id) => {
  return handleRequest(() => axios.delete(`${API_URL}/${id}`, config));
};

export const addModule = async (courseId, moduleData) => {
  return handleRequest(() => axios.post(`${API_URL}/${courseId}/modules`, moduleData, config));
};

export const deleteModule = async (courseId, moduleId) => {
  return handleRequest(() => axios.delete(`${API_URL}/${courseId}/modules/${moduleId}`, config));
};

export const addTopic = async (courseId, moduleId, topicData) => {
  return handleRequest(() => axios.post(`${API_URL}/${courseId}/modules/${moduleId}/topics`, topicData, config));
};

export const deleteTopic = async (courseId, moduleId, topicId) => {
  return handleRequest(() => axios.delete(`${API_URL}/${courseId}/modules/${moduleId}/topics/${topicId}`, config));
};

export const completeTopic = async (courseId, moduleId, topicId) => {
    try {
        const response = await handleRequest(() => 
            axios.patch(
                `${API_URL}/${courseId}/modules/${moduleId}/topics/${topicId}/complete`, 
                {},
                config 
            )
        );
        return response.data;  
    } catch (error) {
        console.error("Error completing topic:", error);
        throw new Error(error.response?.data?.message || "Failed to complete topic");
    }
};

