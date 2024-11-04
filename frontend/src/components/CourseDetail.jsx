import React from 'react';
import { useParams } from 'react-router-dom';

const CourseDetail = () => {
  const { courseId } = useParams();

  const courseDetails = {
    '1': { name: 'Introduction to Psychology', modules: ['Module 1', 'Module 2'], progress: 60 },
    '2': { name: 'Calculus I', modules: ['Module 1', 'Module 2', 'Module 3'], progress: 45 },
    '3': { name: 'Computer Science Basics', modules: ['Module 1', 'Module 2', 'Module 3', 'Module 4'], progress: 80 },
  };

  const course = courseDetails[courseId];

  return (
    <div className="max-w-md mx-auto p-6 bg-white border rounded-lg shadow-md mt-10">
      <h2 className="text-xl font-semibold text-gray-700">{course?.name}</h2>
      <p className="text-sm text-gray-600">Progress: {course?.progress}%</p>
      <h3 className="mt-4 font-semibold">Modules</h3>
      <ul className="divide-y divide-gray-200 mt-2">
        {course?.modules.map((module, index) => (
          <li key={index} className="py-2">{module}</li>
        ))}
      </ul>
    </div>
  );
};

export default CourseDetail;
