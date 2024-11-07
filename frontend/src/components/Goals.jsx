// src/components/Goals.jsx
import React, { useState, useEffect } from "react";
import {
  getGoals,
  addGoal,
  updateGoal,
  deleteGoal,
} from "../redux/slices/goals/apiService";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

function Goals() {
  const [goals, setGoals] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [newGoal, setNewGoal] = useState({
    id: null,
    title: "",
    deadline: "",
    priority: "low",
    isCompleted: false,
    type: "Personal Task",
  });
  const [editGoalId, setEditGoalId] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const fetchGoals = async () => {
    try {
      const goalsData = await getGoals();
      const validGoals = goalsData.map((goal) => ({
        ...goal,
        id: goal._id,
      }));
      setGoals(validGoals);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleSaveGoal = async () => {
    if (newGoal.title && newGoal.deadline) {
      try {
        if (newGoal.id) {
          const updatedGoal = await updateGoal(newGoal.id, newGoal);
          setGoals((prevGoals) =>
            prevGoals.map((goal) =>
              goal.id === newGoal.id ? updatedGoal : goal
            )
          );
          setEditGoalId(null);
        } else {
          const { id, ...goalDataWithoutId } = newGoal;
          const newGoalData = await addGoal(goalDataWithoutId);
          setGoals((prevGoals) => [...prevGoals, newGoalData]);
        }
        await fetchGoals();
        setNewGoal({
          id: null,
          title: "",
          deadline: "",
          priority: "low",
          isCompleted: false,
          type: "Personal Task",
        });
        setShowDialog(false);
      } catch (error) {
        console.error("Error saving goal:", error);
      }
    }
  };

  const handleToggleCompletion = async (goalId, currentStatus) => {
    try {
      const updatedGoal = { isCompleted: !currentStatus };
      const updatedGoalData = await updateGoal(goalId, updatedGoal);
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal.id === goalId ? { ...updatedGoalData, id: goal.id } : goal
        )
      );
    } catch (error) {
      console.error("Error updating goal completion:", error);
    }
  };

  const handleEditGoal = (goal) => {
    setEditGoalId(goal.id);
    setNewGoal({
      id: goal.id,
      title: goal.title,
      deadline: goal.deadline,
      priority: goal.priority,
      isCompleted: goal.isCompleted,
      type: goal.type,
    });
    setShowDialog(true);
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      await deleteGoal(goalId);
      setGoals(goals.filter((goal) => goal.id !== goalId));
      setDeleteConfirmation(null);
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  const displayableGoals = goals.filter((goal) => {
    const goalDate = new Date(goal.deadline);
    goalDate.setHours(0, 0, 0, 0);
    return goalDate.getTime() == today.getTime();
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      default:
        return "bg-green-500";
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 p-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Goals</h1>

      <h2 className="text-2xl font-semibold text-gray-700 mb-1">
        Today's Goals
      </h2>

      <div className="w-[400px] bg-white max-h-[400px] overflow-y-auto mt-6 shadow-lg rounded-lg p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {displayableGoals.map((goal) => (
          <div
            key={goal.id}
            className={`${getPriorityColor(
              goal.priority
            )} text-white p-4 m-2 rounded-lg shadow-md`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{goal.title}</h3>
                <p className="text-sm">
                  Deadline: {new Date(goal.deadline).toLocaleDateString()}
                </p>
                <p className="text-sm">Priority: {goal.priority}</p>
                <p className="text-sm">Type: {goal.type}</p>
              </div>
              <div className="flex gap-1 items-center space-x-3">
                <input
                  type="checkbox"
                  checked={goal.isCompleted}
                  onChange={() =>
                    handleToggleCompletion(goal.id, goal.isCompleted)
                  }
                  className="w-5 h-5 rounded-full border-gray-400 checked:bg-green-500"
                />
                <button
                  onClick={() => handleEditGoal(goal)}
                  className="text-blue-300 hover:text-blue-500 text-2xl"
                >
                  <FaRegEdit />
                </button>
                <button
                  onClick={() => setDeleteConfirmation(goal.id)}
                  className="text-black hover:text-red-600 text-2xl"
                >
                  <MdDeleteOutline />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this goal?</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleDeleteGoal(deleteConfirmation)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-semibold mb-4">
              {editGoalId ? "Edit Goal" : "Create New Goal"}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Goal Title"
                value={newGoal.title}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, title: e.target.value })
                }
                className="border border-gray-300 p-2 rounded w-full"
              />
              <input
                type="date"
                value={newGoal.deadline}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, deadline: e.target.value })
                }
                className="border border-gray-300 p-2 rounded w-full"
              />
              <select
                value={newGoal.priority}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, priority: e.target.value })
                }
                className="border border-gray-300 p-2 rounded w-full"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <select
                value={newGoal.type}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, type: e.target.value })
                }
                className="border border-gray-300 p-2 rounded w-full"
              >
                <option value="Personal Task">Personal Task</option>
                <option value="Course Assignment">Course Assignment</option>
              </select>
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={handleSaveGoal}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setShowDialog(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowDialog(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-6 shadow-lg"
      >
        Add New Goal
      </button>
    </div>
  );
}

export default Goals;
