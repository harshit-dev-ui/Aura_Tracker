import React, { useState } from 'react';

const Schedule = () => {
  const [schedule, setSchedule] = useState({
    today: [
      { id: '1', type: 'Class', name: 'Calculus I', time: '10:00 AM' },
      { id: '2', type: 'Deadline', name: 'Psychology Assignment', time: '11:59 PM' },
    ],
    upcoming: [
      { id: '3', type: 'Class', name: 'Physics II', date: '2024-11-06', time: '9:00 AM' },
      { id: '4', type: 'Deadline', name: 'Calculus Homework', date: '2024-11-07', time: '11:59 PM' },
      { id: '5', type: 'Class', name: 'Literature', date: '2024-11-08', time: '1:00 PM' },
    ],
  });

  const openCalendar = () => {
    alert("Opening full calendar view...");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-lg mt-8">
      {/* Today's Schedule Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Today's Schedule</h2>
        <ul className="divide-y divide-gray-200">
          {schedule.today.map(event => (
            <li key={event.id} className="py-4 flex justify-between items-center hover:bg-gray-50 transition duration-200">
              <div>
                <p className="text-lg font-medium text-gray-900">{event.name}</p>
                <p className="text-sm text-gray-600">{event.type} at {event.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Upcoming Events Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upcoming Events</h2>
        <ul className="divide-y divide-gray-200">
          {schedule.upcoming.map(event => (
            <li key={event.id} className="py-4 flex justify-between items-center hover:bg-gray-50 transition duration-200">
              <div>
                <p className="text-lg font-medium text-gray-900">{event.name}</p>
                <p className="text-sm text-gray-600">{event.type} on {event.date} at {event.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* View Full Calendar Button */}
      <button
        onClick={openCalendar}
        className="mt-6 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
      >
        View Full Calendar
      </button>
    </div>
  );
};

export default Schedule;
