import React, { useState, useEffect } from "react";
import Goals from "../components/Goals";
import CoursesEnrolled from "../components/CoursesEnrolled";
import Schedule from "../components/Schedule";

function Dashboard() {
  return (
    <div className="flex h-screen space-x-6 p-6 bg-gray-100 relative">
      {/* Courses Enrolled Section */}
      <div className="flex-2 bg-white shadow-md rounded-2xl p-8 flex flex-col items-center space-y-6 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Courses Enrolled
        </h2>
        <CoursesEnrolled />
      </div>
      {/* Goals Section */}
      <div className="flex-1 bg-white shadow-md rounded-2xl p-8 flex flex-col items-center space-y-6 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-3xl font-bold text-gray-900 mb-1">
          Goals and Schedule
        </h2>
        <Goals />
      </div>
    </div>
  );
}

export default Dashboard;
