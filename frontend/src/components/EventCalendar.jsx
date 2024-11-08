import React, { useState, useRef } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const EventCalendar = ({ events }) => {
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const calendarRef = useRef(null);

  const handleEventHover = (event, e) => {
    // Get the position of the calendar container
    const calendarBounds = calendarRef.current.getBoundingClientRect();
    const popupWidth = 200;
    const popupHeight = 150;

    // Calculate initial x and y based on mouse position relative to the calendar
    let x = e.clientX - calendarBounds.left + 20;
    let y = e.clientY - calendarBounds.top + 20;

    // Adjust if pop-up goes beyond the right edge of the calendar
    if (x + popupWidth > calendarBounds.width) {
      x = e.clientX - calendarBounds.left - popupWidth - 20;
    }

    // Adjust if pop-up goes beyond the bottom edge of the calendar
    if (y + popupHeight > calendarBounds.height) {
      y = e.clientY - calendarBounds.top - popupHeight - 20;
    }

    setHoveredEvent(event);
    setPopupPosition({ x, y });
  };

  const handleEventHoverOut = () => {
    setHoveredEvent(null);
  };

  return (
    <div className="relative" ref={calendarRef}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        views={["month", "week", "day"]}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor:
              new Date(event.deadline) < new Date() ? "red" : "green",
          },
        })}
        components={{
          event: ({ event }) => (
            <span
              onMouseEnter={(e) => handleEventHover(event, e)}
              onMouseLeave={handleEventHoverOut}
              className="cursor-pointer"
            >
              {event.title}
            </span>
          ),
        }}
      />
      {hoveredEvent && (
        <div
          className="absolute bg-white border border-gray-300 p-4 rounded-lg shadow-lg w-48 pointer-events-none transform -translate-y-1/2 z-50"
          style={{ top: popupPosition.y, left: popupPosition.x }}
        >
          <h4 className="text-lg font-semibold mb-2">{hoveredEvent.title}</h4>
          <p className="text-sm text-gray-700 mb-1">
            {hoveredEvent.description}
          </p>
          <p className="text-xs text-gray-500">
            <strong>Start:</strong> {hoveredEvent.start.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">
            <strong>End:</strong> {hoveredEvent.end.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;
