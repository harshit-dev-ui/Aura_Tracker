import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getCourses } from '../utils/courseService';
import { useNavigate } from 'react-router-dom';

function Courses() {
  const [courses, setCourses] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();  
  const user = useSelector((state) => state.user.currentUser); 

  useEffect(() => {
    if (!user) {
        navigate("/login");
        return;
      }

    const fetchCourses = async () => {
      try {
        setLoading(true);  
        const data = await getCourses();
        setCourses(data); 
        setLoading(false); 
      } catch (error) {
        setLoading(false); 
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [user, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const handleAddCourse = async () => {
    try {
      if (!newCourseName || !newCourseDescription) {
        throw new Error("Please enter Course Name and Description");
      }

      const newCourse = {
        name: newCourseName,
        description: newCourseDescription,
        progress: 0,
        modules: [],
      };

      setCourses([...courses, newCourse]);
      setIsModalOpen(false);
      setNewCourseName("");
      setNewCourseDescription("");
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Courses</h1>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              onClick={() => handleCourseClick(course._id)} 
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl cursor-pointer transition-all"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{course.name}</h2>
              <p className="text-gray-600 text-sm">{course.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">You don't have any courses yet.</p>
      )}

      <div className="fixed bottom-10 right-10">
        <button
          onClick={() => setIsModalOpen(true)} 
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Add Course
        </button>
      </div>

      {/* Modal for Adding Course */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-96 relative">
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
                onClick={() => setIsModalOpen(false)}
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
}

export default Courses;
