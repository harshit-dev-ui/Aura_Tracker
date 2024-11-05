import React, { useState, useEffect } from "react";

function Goals() {
  const [goals, setGoals] = useState([]); // State to hold the goals
  const [showDialog, setShowDialog] = useState(false); // State to control dialog visibility
  const [newGoal, setNewGoal] = useState({
    title: "",
    deadline: "",
    priority: "low",
    isCompleted: false,
  });

  // Helper function to clear the time portion of a Date object
  const clearTime = (date) => {
    date.setHours(0, 0, 0, 0);
    return date;
  };

  // Get today's date with time cleared
  const today = clearTime(new Date());

  // Function to handle adding a new goal
  const addGoal = () => {
    if (newGoal.title && newGoal.deadline) {
      setGoals((prevGoals) => [...prevGoals, newGoal]);
      setNewGoal({
        title: "",
        deadline: "",
        priority: "low",
        isCompleted: false,
      });
      setShowDialog(false);
    }
  };

  // Mark a goal as completed
  const toggleCompletion = (index) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal, i) =>
        i === index ? { ...goal, isCompleted: !goal.isCompleted } : goal
      )
    );
  };

  // Remove completed goals with today's deadline at the end of the day
  useEffect(() => {
    const timer = setTimeout(() => {
      setGoals((prevGoals) =>
        prevGoals.filter(
          (goal) =>
            goal.deadline !== today.toISOString().split("T")[0] ||
            !goal.isCompleted
        )
      );
    }, 24 * 60 * 60 * 1000); // Run this every 24 hours

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [goals, today]);

  const todaysGoals = goals.filter((goal) => {
    const goalDate = clearTime(new Date(goal.deadline));
    return goalDate.getTime() === today.getTime();
  });

  const futureGoals = goals.filter((goal) => {
    const goalDate = clearTime(new Date(goal.deadline));
    return goalDate.getTime() > today.getTime();
  });

  // Function to determine background color based on priority
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-600";
      case "medium":
        return "bg-yellow-500";
      default:
        return "bg-green-500";
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <h1 className="text-2xl font-bold">Goals</h1>
      <div className="bg-gray-100 w-[400px] px-2 flex flex-col items-center py-4">
        <h2 className="text-lg font-semibold">Today's Goals</h2>
        <div className="w-full max-h-48 overflow-y-auto">
          {todaysGoals.length === 0 ? (
            <p className="text-center text-gray-600">No goals for today.</p>
          ) : (
            todaysGoals.map((goal, index) => (
              <div
                key={index}
                className={`${getPriorityColor(
                  goal.priority
                )} text-white p-2 m-2 rounded flex items-center ${
                  goal.isCompleted ? "line-through opacity-50" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={goal.isCompleted}
                  onChange={() => toggleCompletion(index)}
                  className="mr-2"
                />
                <div>
                  <h3 className="font-semibold">{goal.title}</h3>
                  <p>Deadline: {goal.deadline}</p>
                  <p>Priority: {goal.priority}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-gray-100 w-full px-2 flex flex-col items-center py-4 mt-4">
        <h2 className="text-lg font-semibold">Future Goals</h2>
        <div className="w-full">
          {futureGoals.length === 0 ? (
            <p className="text-center text-gray-600">No future goals set.</p>
          ) : (
            futureGoals.map((goal, index) => (
              <div
                key={index}
                className={`${getPriorityColor(
                  goal.priority
                )} text-white p-2 m-2 rounded`}
              >
                <h3 className="font-semibold">{goal.title}</h3>
                <p>Deadline: {goal.deadline}</p>
                <p>Priority: {goal.priority}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <button
        onClick={() => setShowDialog(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Add New Goal
      </button>

      {/* Dialog for creating new goal */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold">Create New Goal</h2>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Goal Title"
                value={newGoal.title}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, title: e.target.value })
                }
                className="border border-gray-300 p-2 rounded w-full mb-2"
              />
              <input
                type="date"
                value={newGoal.deadline}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, deadline: e.target.value })
                }
                className="border border-gray-300 p-2 rounded w-full mb-2"
              />
              <select
                value={newGoal.priority}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, priority: e.target.value })
                }
                className="border border-gray-300 p-2 rounded w-full mb-4"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <div className="flex justify-between">
                <button
                  onClick={addGoal}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Add Goal
                </button>
                <button
                  onClick={() => setShowDialog(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Goals;
