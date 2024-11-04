import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const CoursesEnrolled = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [courses, setCourses] = useState([
        {
            _id: '1',
            name: 'Introduction to Psychology',
            progress: 60,
            modules: [
                { id: 'm1', name: 'Chapter 1: Basics', progress: 100 },
                { id: 'm2', name: 'Chapter 2: Behavior', progress: 80 },
                { id: 'm3', name: 'Chapter 3: Cognition', progress: 40 },
            ],
        },
        {
            _id: '2',
            name: 'Calculus I',
            progress: 45,
            modules: [
                { id: 'm1', name: 'Limits', progress: 100 },
                { id: 'm2', name: 'Derivatives', progress: 50 },
            ],
        },
        {
            _id: '3',
            name: 'Computer Science Basics',
            progress: 80,
            modules: [
                { id: 'm1', name: 'Data Structures', progress: 90 },
                { id: 'm2', name: 'Algorithms', progress: 70 },
            ],
        },
    ]);

    const [newCourseId, setNewCourseId] = useState('');

    const handleAddCourse = () => {
        try {
            if (!newCourseId) {
                throw new Error('Please enter Course Name');
            }

            const newCourse = {
                _id: new Date().toISOString(),
                name: newCourseId,
                progress: 0,
                modules: [],
            };
            setCourses([...courses, newCourse]);
            setNewCourseId('');
        } catch (error) {
            console.log(error.message);
            alert(error.message);
        }
    };

    const handleSelectCourse = (courseId) => {
        navigate(`/courses/${courseId}`); // Navigate to course detail page
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
                <h3 className="text-lg font-semibold text-gray-700">Add New Course</h3>
                <input
                    type="text"
                    value={newCourseId}
                    onChange={(e) => setNewCourseId(e.target.value)}
                    placeholder="Enter Course Name"
                    className="mt-2 px-4 py-2 w-3/4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleAddCourse}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Add Course
                </button>
            </div>
        </div>
    );
};

export default CoursesEnrolled;
