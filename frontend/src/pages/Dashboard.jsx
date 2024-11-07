import React from "react";
import Goals from "../components/Goals";
import CoursesEnrolled from "../components/CoursesEnrolled";
import Schedule from "../components/Schedule";

function Dashboard() {
  return (
    <div className="flex h-screen space-x-6 p-6 bg-gray-100">
      {/* Courses Enrolled Section */}
      <div className="flex-1 bg-white shadow-md rounded-2xl p-8 flex flex-col items-center space-y-6 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Courses Enrolled
        </h2>
        <CoursesEnrolled />
      </div>

      {/* Schedule Section */}
      <div className="flex-1 bg-white shadow-md rounded-2xl p-8 flex flex-col items-center space-y-6 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Schedule</h2>
        <Schedule />
      </div>

      {/* Goals Section */}
      <div className="flex-1 bg-white shadow-md rounded-2xl p-8 flex flex-col items-center space-y-6 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-3xl font-bold text-gray-900 mb-1">Goals</h2>
        <Goals />
      </div>
    </div>
  );
}

export default Dashboard;
