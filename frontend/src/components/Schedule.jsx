import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import EventCalendar from "./EventCalendar";
import { getGoals } from "../redux/slices/goals/apiService.js";

const Schedule = () => {
  const [schedule, setSchedule] = useState([]);
  const user = useSelector((state) => state.user);

  const connectGoogleCalendar = () => {
    window.location.href = "http://localhost:5000/api/calendar/auth/google";
  };

  const fetchCalendarEvents = async () => {
    try {
      // Fetch goals from backend
      const goals = await getGoals();

      // Format goals as events for calendar
      const formattedGoals = goals.map((goal) => ({
        title: goal.title,
        start: new Date(goal.deadline),
        end: new Date(goal.deadline),
        priority: goal.priority,
        type: goal.type,
      }));

      setSchedule([...formattedGoals]);
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  useEffect(() => {
    fetchCalendarEvents();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-lg mt-8">
      <EventCalendar events={schedule} />
    </div>
  );
};

export default Schedule;
