import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCourses, createCourse } from '../utils/courseService';

const CoursesEnrolled = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector(state => state.user.currentUser);

    const [courses, setCourses] = useState([]);
    const [newCourseName, setNewCourseName] = useState('');
    const [newCourseDescription, setNewCourseDescription] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchCourses = async () => {
            try {
                const data = await getCourses();
                setCourses(data);
            } catch (error) {
                console.error("Error fetching courses:", error);
                alert("Failed to fetch courses. Please try again.");
            }
        };

        fetchCourses();
    }, [user, navigate]);

    const handleAddCourse = async () => {
        try {
            if (!newCourseName || !newCourseDescription) {
                throw new Error('Please enter Course Name and Description');
            }

            const newCourse = {
                name: newCourseName,
                description: newCourseDescription,
                progress: 0,
                modules: [],
            };

            const createdCourse = await createCourse(newCourse, user._id);
            setCourses([...courses, createdCourse]);
            setIsModalOpen(false); // Close modal
            setNewCourseName('');
            setNewCourseDescription('');
        } catch (error) {
            console.log(error.message);
            alert(error.message);
        }
    };

    const handleSelectCourse = (courseId) => {
        navigate(`/courses/${courseId}`);
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white border rounded-lg shadow-md mt-10">
            <h2 className="text-xl font-semibold text-gray-700">Courses Enrolled</h2>
            <ul className="divide-y divide-gray-200 mt-4">
                {courses.map(course => (
                    <li key={course._id} className="py-4 flex justify-between items-center">
                        <div
                            onClick={() => handleSelectCourse(course._id)}
                            className="flex justify-between items-center cursor-pointer"
                        >
                            <h3 className="text-lg font-medium text-gray-800">{course.name}</h3>
                            <p className="text-sm text-gray-600">Progress: {course.progress}%</p>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="mt-6 text-center">
                <button
                    onClick={() => setIsModalOpen(true)} // Open modal when clicking "Add Course"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Add Course
                </button>
            </div>

            {/* Modal for Adding Course */}
            {isModalOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Course</h3>

                        <input
                            type="text"
                            placeholder="Course Title"
                            value={newCourseName}
                            onChange={(e) => setNewCourseName(e.target.value)}
                            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <textarea
                            placeholder="Course Description"
                            value={newCourseDescription}
                            onChange={(e) => setNewCourseDescription(e.target.value)}
                            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>

                        <div className="flex justify-end">
                            <button
                                onClick={handleAddCourse}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Add Course
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)} // Close modal
                                className="ml-2 px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoursesEnrolled;
