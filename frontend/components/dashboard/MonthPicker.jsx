"use client";

import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

// Custom Input Component for DatePicker
const CustomDateInput = forwardRef((props, ref) => (
  <button 
    {...props}
    className="bg-[#2C2C2E] text-white flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-[#3A3A3C] transition-colors border border-transparent hover:border-[#D8EFA8]/30"
    ref={ref}
  >
    {props.value} <ChevronDown size={14} className="text-gray-400" />
  </button>
));

CustomDateInput.displayName = 'CustomDateInput';

const MonthPicker = ({ selectedDate, onChange }) => {
  return (
    <>
      <div className="relative z-20">
        <DatePicker
          selected={selectedDate}
          onChange={onChange}
          dateFormat="MMM yy"
          showMonthYearPicker
          maxDate={new Date()}
          customInput={<CustomDateInput />}
          calendarClassName="custom-datepicker-calendar"
        />
      </div>
      
      {/* DatePicker Styles */}
      <style jsx global>{`
        .custom-datepicker-calendar {
          font-family: inherit !important;
          background-color: #1C1C1E !important;
          border: 1px solid #333 !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3) !important;
          padding: 10px !important;
        }
        
        .react-datepicker__header {
          background-color: transparent !important;
          border-bottom: 1px solid #333 !important;
          padding-top: 5px !important;
          padding-bottom: 10px !important;
        }

        .react-datepicker__current-month {
          color: white !important;
          font-size: 0.9rem !important;
          font-weight: 600 !important;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .react-datepicker__month-container {
          float: none !important;
        }

        .react-datepicker__month {
          margin: 10px 0 0 0 !important;
        }

        /* Month items */
        .react-datepicker__month-text {
          margin: 4px !important;
          padding: 8px 4px !important;
          width: 3.5rem !important;
          color: #9CA3AF !important; /* text-gray-400 */
          border-radius: 8px !important;
          font-size: 0.85rem !important;
          font-weight: 500 !important;
          transition: all 0.2s ease;
        }

        .react-datepicker__month-text:hover {
          background-color: #333 !important;
          color: white !important;
        }

        /* Selected State */
        .react-datepicker__month-text--keyboard-selected,
        .react-datepicker__month-text--selected {
          background-color: #D8EFA8 !important;
          color: black !important;
          font-weight: 700 !important;
        }
        
        .react-datepicker__month-text--keyboard-selected:hover,
        .react-datepicker__month-text--selected:hover {
          background-color: #c5e08b !important;
          color: black !important;
        }

        /* Navigation Arrows */
        .react-datepicker__navigation {
          top: 15px !important;
        }
        
        .react-datepicker__navigation-icon::before {
          border-color: #6B7280 !important; /* gray-500 */
          border-width: 2px 2px 0 0 !important;
        }
        
        .react-datepicker__navigation:hover .react-datepicker__navigation-icon::before {
          border-color: #D8EFA8 !important;
        }

        /* Remove Triangle */
        .react-datepicker__triangle {
          display: none !important;
        }
      `}</style>
    </>
  );
};

export default MonthPicker;
