import React from "react";
import Goals from "../components/Goals";
function Dashboard() {
  return (
    <div className="flex h-screen justify-between">
      <div className="w-1/3 bg-slate-50  flex items-center justify-center text-lg text-gray-700 m-4">
        Container 1
      </div>
      <div className="w-1/3 bg-slate-50  flex items-center justify-center text-lg text-gray-700 m-4">
        Container 2
      </div>
      <div className="w-1/3 bg-slate-50  flex items-center justify-center text-lg text-gray-700 m-4">
        <Goals />
      </div>
    </div>
  );
}

export default Dashboard;
