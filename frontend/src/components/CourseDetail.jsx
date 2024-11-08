import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById, addModule, deleteModule, addTopic, deleteTopic, completeTopic, deleteCourse } from '../utils/courseService';
import { FaChevronDown, FaChevronUp, FaPlus, FaTrash } from 'react-icons/fa'; 
import { getUserAuraPoints } from '../utils/getuserAuraPoints';
import { useDispatch, useSelector } from 'react-redux';
import { updateAuraPoints } from '../redux/slices/auth/userSlice';

const CourseDetail = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [course, setCourse] = useState(null);
    const [newModuleName, setNewModuleName] = useState('');
    const [newTopicNames, setNewTopicNames] = useState({});
    const [expandedModules, setExpandedModules] = useState({});
    const auraPoints = useSelector((state) => state.user.currentUser.auraPoints);

    const fetchAuraPoints = async () => {
        try {
            const points = await getUserAuraPoints(); 
            dispatch(updateAuraPoints(points));
        } catch (error) {
            console.error("Failed to fetch aura points:", error);
        }
    };

    useEffect(() => {
        fetchAuraPoints();
    }, []);

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
    }, [courseId,newModuleName,newTopicNames]);

    const calculateCourseProgress = () => {
        if (!course || !Array.isArray(course.modules)) return 0;  
        const totalTopics = course.modules.reduce((sum, module) => module.topics ? sum + module.topics.length : sum, 0);
        const completedTopics = course.modules.reduce((sum, module) => module.topics ? sum + module.topics.filter(topic => topic.completed).length : sum, 0);
        return totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    };

    const handleAddModule = async () => {
        if (!newModuleName) return alert('Please enter Module Name');
        try {
            const addedModule = await addModule(courseId, { title: newModuleName });
            setCourse(prev => ({ ...prev, modules: [...prev.modules, addedModule] }));
            setNewModuleName('');
        } catch (error) {
            console.error(error.message);
            alert(error.message);
        }
    };

    const handleDeleteModule = async (moduleId) => {
        try {
            await deleteModule(courseId, moduleId);
            setCourse(prev => ({ ...prev, modules: prev.modules.filter(module => module._id !== moduleId) }));
            await fetchAuraPoints();
        } catch (error) {
            console.error(error.message);
            alert(error.message);
        }
    };

    const handleAddTopic = async (moduleId) => {
        const newTopicName = newTopicNames[moduleId];
        if (!newTopicName) return alert('Please enter Topic Name');
        try {
            const addedTopic = await addTopic(courseId, moduleId, { title: newTopicName });
            setCourse(prev => ({
                ...prev,
                modules: prev.modules.map(module => module._id === moduleId
                    ? { ...module, topics: [...module.topics, addedTopic] }
                    : module)
            }));
            setNewTopicNames(prev => ({ ...prev, [moduleId]: '' }));
            await fetchAuraPoints();
        } catch (error) {
            console.error(error.message);
            alert(error.message);
        }
    };

    const handleDeleteTopic = async (moduleId, topicId) => {
        try {
            await deleteTopic(courseId, moduleId, topicId);
            setCourse(prev => ({
                ...prev,
                modules: prev.modules.map(module =>
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
            setCourse(prev => ({
                ...prev,
                modules: prev.modules.map(module =>
                    module._id === moduleId
                        ? { ...module, topics: module.topics.map(topic =>
                            topic._id === topicId ? { ...topic, completed: !topic.completed } : topic
                        )}
                        : module
                ),
            }));
            await fetchAuraPoints();
        } catch (error) {
            console.error(error.message);
            alert(error.message);
        }
    };

    const handleTopicInputChange = (moduleId, value) => {
        setNewTopicNames(prev => ({ ...prev, [moduleId]: value }));
    };

    const toggleDropdown = (moduleId) => {
        setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
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


    if (!course) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white border rounded-lg shadow-md mt-10 relative">
            <div className="absolute top-4 right-4">
                <button onClick={handleDeleteCourse} className="bg-red-500 text-white px-3 py-2 rounded-full hover:bg-red-600">
                    <FaTrash/>
                </button>
            </div>
            <div className="absolute top-3 right-20 bg-blue-500 text-white px-4 py-2 rounded-full">
                Aura Points: {auraPoints}
            </div>

            <h2 className="text-3xl font-bold text-gray-700">{course.name}</h2>
            <p className="text-gray-500 mt-2">{course.description}</p>

            <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-700">Course Progress</h3>
                <div className="w-full bg-gray-300 h-2 mt-2">
                    <div className="bg-blue-500 h-2" style={{ width: `${calculateCourseProgress()}%` }} />
                </div>
                <p className="text-gray-600 mt-1">Progress: {calculateCourseProgress()}%</p>
            </div>

            <div className="mt-6 flex items-center space-x-2">
                <input
                    type="text"
                    value={newModuleName}
                    onChange={(e) => setNewModuleName(e.target.value)}
                    placeholder="New Module Name"
                    className="border p-2 w-full rounded"
                />
                <button onClick={handleAddModule} className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
                    <FaPlus />
                </button>
            </div>

            <ul className="divide-y divide-gray-200 mt-6">
                {course.modules.map((module) => (
                    <li key={module._id} className="py-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <button onClick={() => toggleDropdown(module._id)} className="text-gray-600 hover:text-gray-800">
                                    {expandedModules[module._id] ? <FaChevronUp /> : <FaChevronDown />}
                                </button>
                                <h4 className="text-xl font-semibold text-gray-700">{module.title}</h4>
                            </div>
                            <button onClick={() => handleDeleteModule(module._id)} className="text-red-500 hover:text-red-700">
                                <FaTrash />
                            </button>
                        </div>

                        {expandedModules[module._id] && (
                            <div className="mt-4">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={newTopicNames[module._id] || ''}
                                        onChange={(e) => handleTopicInputChange(module._id, e.target.value)}
                                        placeholder="New Topic Name"
                                        className="border p-2 w-full rounded"
                                    />
                                    <button onClick={() => handleAddTopic(module._id)} className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
                                        <FaPlus />
                                    </button>
                                </div>

                                <ul className="mt-4">
                                    {module.topics.map((topic) => (
                                        <li key={topic._id} className="flex justify-between items-center py-2">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={topic.completed}
                                                    onChange={() => handleMarkTopicComplete(module._id, topic._id)}
                                                    className="form-checkbox"
                                                />
                                                <span className={topic.completed ? 'line-through text-gray-500' : 'text-gray-700'}>{topic.title}</span>
                                            </div>
                                            <button onClick={() => handleDeleteTopic(module._id, topic._id)} className="text-red-500 hover:text-red-700">
                                                <FaTrash />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CourseDetail;
