import React from "react";
import CoursesEnrolled from "../components/CoursesEnrolled";
import Schedule from "../components/Schedule";

function Dashboard() {
  return (
    <div className="flex h-screen space-between">
      <div className="flex-1 bg-gray-200 flex items-center justify-center text-lg text-gray-700 m-4">
       <CoursesEnrolled/>
      </div>
      <div className="flex-1 bg-gray-200 flex items-center justify-center text-lg text-gray-700 m-4">
       <Schedule/>
      </div>
      <div className="flex-1 bg-gray-200 flex items-center justify-center text-lg text-gray-700 m-4">
        Container 3
      </div>
    </div>
  );
}

export default Dashboard;
