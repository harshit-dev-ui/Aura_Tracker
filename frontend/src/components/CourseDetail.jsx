import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById, addModule, deleteModule, addTopic, deleteTopic, completeTopic, deleteCourse } from '../utils/courseService';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // For dropdown icons

const CourseDetail = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [newModuleName, setNewModuleName] = useState('');
    const [newTopicNames, setNewTopicNames] = useState({});
    const [expandedModules, setExpandedModules] = useState({}); // Used for showing dropdown menu

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const data = await getCourseById(courseId);
                if (data) {
                    setCourse(data);
                } else {
                    alert("You are not enrolled in this course.");
                    navigate('/courses');
                }
            } catch (error) {
                console.error("Error fetching course:", error);
                alert("Failed to fetch course details. Please try again.");
            }
        };

        fetchCourse();
    }, [courseId, newModuleName, newTopicNames]);

    const calculateCourseProgress = () => {
        if (!course) return 0;
        const totalTopics = course.modules.reduce((sum, module) => sum + (module.topics.length), 0);
        const completedTopics = course.modules.reduce((sum, module) => sum + (module.topics.filter(topic => topic.completed).length), 0);
        return totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    };

    const handleAddModule = async () => {
        try {
            if (!newModuleName) throw new Error('Please enter Module Name');
            const newModule = { title: newModuleName };
            const addedModule = await addModule(courseId, newModule);
            setCourse(prevCourse => ({ ...prevCourse, modules: [...prevCourse.modules, addedModule] }));
            setNewModuleName('');
        } catch (error) {
            console.error(error.message);
            alert(error.message);
        }
    };

    const handleDeleteModule = async (moduleId) => {
        try {
            await deleteModule(courseId, moduleId);
            setCourse(prevCourse => ({
                ...prevCourse,
                modules: prevCourse.modules.filter(module => module._id !== moduleId),
            }));
        } catch (error) {
            console.error(error.message);
            alert(error.message);
        }
    };

    const handleAddTopic = async (moduleId) => {
        try {
            const newTopicName = newTopicNames[moduleId];
            if (!newTopicName) throw new Error('Please enter Topic Name');
            const newTopic = { title: newTopicName };
            const addedTopic = await addTopic(courseId, moduleId, newTopic);
            setCourse(prevCourse => ({
                ...prevCourse,
                modules: prevCourse.modules.map(module =>
                    module._id === moduleId ? { ...module, topics: [...module.topics, addedTopic] } : module
                ),
            }));
            setNewTopicNames(prevNames => ({ ...prevNames, [moduleId]: '' }));
        } catch (error) {
            console.error(error.message);
            alert(error.message);
        }
    };

    const handleDeleteTopic = async (moduleId, topicId) => {
        try {
            await deleteTopic(courseId, moduleId, topicId);
            setCourse(prevCourse => ({
                ...prevCourse,
                modules: prevCourse.modules.map(module =>
                    module._id === moduleId
                        ? { ...module, topics: module.topics.filter(topic => topic._id !== topicId) }
                        : module
                ),
            }));
        } catch (error) {
            console.error(error.message);
            alert(error.message);
        }
    };

    const handleMarkTopicComplete = async (moduleId, topicId) => {
        try {
            await completeTopic(courseId, moduleId, topicId);
            setCourse(prevCourse => ({
                ...prevCourse,
                modules: prevCourse.modules.map(module =>
                    module._id === moduleId
                        ? {
                            ...module,
                            topics: module.topics.map(topic =>
                                topic._id === topicId
                                    ? { ...topic, completed: !topic.completed }
                                    : topic
                            ),
                        }
                        : module
                ),
            }));
        } catch (error) {
            console.error(error.message);
            alert(error.message);
        }
    };

    const handleTopicInputChange = (moduleId, value) => {
        setNewTopicNames(prevNames => ({ ...prevNames, [moduleId]: value }));
    };

    const toggleDropdown = (moduleId) => {
        setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
    };

    const getModuleProgress = (module) => {
        const topics = module.topics || [];
        return topics.length > 0
            ? Math.round((topics.filter(topic => topic.completed).length / topics.length) * 100)
            : 0;
    };

    const handleDeleteCourse = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this course?');
        if (confirmDelete) {
            try {
                await deleteCourse(courseId);
                alert("Course deleted successfully");
                navigate('/courses');
            } catch (error) {
                console.error(error.message);
                alert("Failed to delete the course. Please try again.");
            }
        }
    };

    if (!course || !course.modules) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white border rounded-lg shadow-md mt-10 relative">
            {/* Delete Course Button positioned top-right */}
            <div className="absolute top-4 right-4">
                <button
                    onClick={handleDeleteCourse}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Delete Course
                </button>
            </div>

            {/* Course Heading and Delete Button */}
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-700">{course?.name}</h2>
            </div>
            <p className="text-gray-500 mt-2">{course?.description}</p>

            {/* Course Progress */}
            <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-700">Course Progress</h3>
                <div className="w-full bg-gray-300 h-2 mt-2">
                    <div className="bg-blue-500 h-2" style={{ width: `${calculateCourseProgress()}%` }} />
                </div>
                <p className="text-gray-600 mt-1">Progress: {calculateCourseProgress()}%</p>
            </div>

            {/* Add Module */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700">Add Module</h3>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={newModuleName}
                        onChange={(e) => setNewModuleName(e.target.value)}
                        placeholder="New Module Name"
                        className="border p-2 w-full"
                    />
                    <button
                        onClick={handleAddModule}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Add
                    </button>
                </div>
            </div>

            {/* Modules Section */}
            <h3 className="text-lg font-semibold text-gray-700 mt-6">Modules</h3>
            <ul className="divide-y divide-gray-200 mt-2">
                {course.modules.map((module) => {
                    const moduleProgress = getModuleProgress(module);

                    return (
                        <li key={module._id} className="py-4">
                            {/* Module Progress Bar */}
                            <div className="mb-2">
                                <div className="w-full bg-gray-300 h-2">
                                    <div
                                        className="bg-blue-500 h-2"
                                        style={{ width: `${moduleProgress}%` }}
                                    />
                                </div>
                            </div>

                            {/* Module Title and Delete Button */}
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-2xl text-blue-700">{module.title}</span>
                                <button
                                    onClick={() => handleDeleteModule(module._id)}
                                    className="text-red-500 hover:underline"
                                >
                                    Delete Module
                                </button>
                            </div>

                            {/* Dropdown to Show/Hide Topics */}
                            <div className="mt-4">
                                <button
                                    onClick={() => toggleDropdown(module._id)}
                                    className="text-blue-500 hover:underline flex items-center"
                                >
                                    {expandedModules[module._id] ? (
                                        <FaChevronUp /> 
                                    ) : (
                                        <FaChevronDown />
                                    )}
                                    {expandedModules[module._id] ? ' Hide Topics' : ' Show Topics'}
                                </button>

                                {/* Topics Section */}
                                {expandedModules[module._id] && (
                                    <div className="mt-2">
                                        <h4 className="text-lg font-semibold">Topics</h4>
                                        {module.topics.length === 0 && <p>No topics yet</p>}
                                        <ul className="mt-2">
                                            {module.topics.map((topic) => (
                                                <li key={topic._id} className="flex justify-between items-center py-2">
                                                    <div className="flex items-center space-x-2">
                                                        <label className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={topic.completed}
                                                                onChange={() => handleMarkTopicComplete(module._id, topic._id)}
                                                                className="mr-2"
                                                            />
                                                            <span className={`text-sm ${topic.completed ? 'line-through' : ''}`}>
                                                                {topic.title}
                                                            </span>
                                                        </label>

                                                        <button
                                                            onClick={() => handleDeleteTopic(module._id, topic._id)}
                                                            className="text-red-500 hover:underline"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="mt-4 flex items-center space-x-2">
                                            <input
                                                type="text"
                                                value={newTopicNames[module._id] || ''}
                                                onChange={(e) => handleTopicInputChange(module._id, e.target.value)}
                                                placeholder="New Topic Name"
                                                className="border p-2 w-full"
                                            />
                                            <button
                                                onClick={() => handleAddTopic(module._id)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                                            >
                                                Add Topic
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default CourseDetail;
