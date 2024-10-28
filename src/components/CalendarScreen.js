import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarScreen = () => {
  const [date, setDate] = useState(new Date());

  const handleDateChange = (newDate) => {
    setDate(newDate);
    console.log('Selected date:', newDate);
  };

  return (
    <div className="flex items-center justify-center h-full">
      {/* <h3 className="text-lg font-semibold text-gray-800 mb-4">Calendar</h3> */}
      <Calendar
        onChange={handleDateChange}
        value={date}
        className="react-calendar"
        
      />
    </div>
  );
};

export default CalendarScreen;
