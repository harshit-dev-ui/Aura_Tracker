import React from "react";
import Goals from "../components/Goals";
import CoursesEnrolled from "../components/CoursesEnrolled";
import Schedule from "../components/Schedule";

function Dashboard() {
  return (
    <div className="flex h-screen space-x-6 p-6">
      {/* Courses Enrolled Section */}
      <div className="flex-1 bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-start space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Courses Enrolled
        </h2>
        <CoursesEnrolled />
      </div>

      {/* Schedule Section */}
      <div className="flex-1 bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-start space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Schedule</h2>
        <Schedule />
      </div>
      <div className="w-1/3 bg-gray-200  flex items-center justify-center text-lg text-gray-700 m-4">
        <Goals />
      </div>
    </div>
  );
}

export default Dashboard;
