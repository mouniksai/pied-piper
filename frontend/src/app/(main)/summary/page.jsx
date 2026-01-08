"use client";

import React, { useState, useRef, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Calendar, ChevronLeft, X, Bot } from "lucide-react";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

// --- CONFIGURATION ---
const THEME = {
  colors: {
    bg: "#0A0A0A", // Jet Black
    surface: "#1C1C1E", // Charcoal Gray
    text: "#FFFFFF", // Pure White
    lime: "#D8EFA8", // Pale Lime (AI Accent)
    lavender: "#CDC9EF", // Soft Lavender (Secondary Accent)
  },
};

// --- COMPONENTS ---

// Custom DatePicker Button
const CustomDateInput = forwardRef(({ value, onClick, isActive }, ref) => (
  <button
    onClick={onClick}
    ref={ref}
    className="p-3 rounded-full hover:bg-white/5 transition-colors group relative"
  >
    <Calendar
      size={20}
      className={isActive ? "text-[#CDC9EF]" : "text-gray-400"}
    />
  </button>
));

CustomDateInput.displayName = 'CustomDateInput';

/**
 * MessageBubble Component
 * Renders individual chat messages with distinct styles for User vs AI.
 */
const MessageBubble = ({ message }) => {
  const isUser = message.sender === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[80%] md:max-w-[60%] p-4 rounded-2xl text-sm md:text-base leading-relaxed shadow-lg ${
          isUser
            ? `bg-[${THEME.colors.surface}] text-white rounded-tr-sm`
            : `bg-[${THEME.colors.lime}] text-black rounded-tl-sm font-medium`
        }`}
        style={{
          backgroundColor: isUser ? THEME.colors.surface : THEME.colors.lime,
          color: isUser ? THEME.colors.text : "#0A0A0A",
        }}
      >
        {/* Render text */}
        <p>{message.text}</p>
        
        {/* Render attached date if exists */}
        {message.date && (
          <div className="mt-2 flex items-center gap-1 text-xs opacity-70 border-t border-black/10 pt-2">
            <Calendar size={12} />
            <span>Context: {message.date}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

/**
 * TypingIndicator Component
 * Shows a subtle animation when the AI is "thinking".
 */
const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex justify-start mb-4"
  >
    <div
      className="p-4 rounded-2xl rounded-tl-sm"
      style={{ backgroundColor: THEME.colors.surface }}
    >
      <div className="flex space-x-1">
        {[0, 1, 2].map((dot) => (
          <motion.div
            key={dot}
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: THEME.colors.lavender }}
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: dot * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  </motion.div>
);

/**
 * Header Component
 * Simple navigation and title.
 */
const Header = () => (
  <header
    className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between backdrop-blur-md border-b border-white/5"
    style={{ backgroundColor: `${THEME.colors.bg}CC` }}
  >
    <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
      <ChevronLeft color={THEME.colors.text} size={24} />
    </button>
    <div className="text-center">
      <h1 className="text-lg font-semibold tracking-wide text-white">
       Jared
      </h1>
      <p className="text-xs text-gray-400">Financial Assistant</p>
    </div>
    <div className="w-10" /> {/* Spacer for centering */}
  </header>
);

// --- MAIN PAGE COMPONENT ---

export default function FinancialSummaryChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hello! I've analyzed your cash flow. Ask me for a summary or choose a specific date range to forecast.",
      date: null,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  // Date State for Single/Range
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Helper to format date label
  const getDateLabel = () => {
    if (startDate && endDate) {
      return `${format(startDate, "MMM d")} - ${format(endDate, "MMM d")}`;
    } else if (startDate) {
      return format(startDate, "MMM d");
    }
    return "";
  };

  const selectedDateLabel = getDateLabel();

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim() && !startDate) return;

    // 1. Add User Message
    const newMessage = {
      id: Date.now(),
      sender: "user",
      text: inputValue || `Show summary for ${selectedDateLabel}`,
      date: selectedDateLabel,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setDateRange([null, null]); // Reset dates
    setIsTyping(true);

    // 2. Simulate AI Response (Mock Logic)
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        sender: "ai",
        text: "Based on your spending patterns, you're on track to save 12% more than last month. Your investments in Tech are up by 4.2%.",
        date: null,
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div
      className="flex flex-col h-screen overflow-hidden font-sans selection:bg-purple-500/30"
      style={{ backgroundColor: THEME.colors.bg }}
    >
      <Header />

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-gray-800">
        <AnimatePresence>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </AnimatePresence>
        
        {isTyping && <TypingIndicator />}
        
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer
        className="p-4 md:p-6 pb-8 border-t border-white/5 relative"
        style={{ backgroundColor: THEME.colors.bg }}
      >
        {/* Date Badge (If selected) */}
        <AnimatePresence>
          {selectedDateLabel && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -top-3 left-6 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg z-20"
              style={{
                backgroundColor: THEME.colors.lavender,
                color: THEME.colors.surface,
              }}
            >
              <Calendar size={12} />
              {selectedDateLabel}
              <button
                onClick={() => setDateRange([null, null])}
                className="hover:bg-black/10 rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Container */}
        <div
          className="flex items-center gap-3 p-2 pr-2 rounded-3xl border border-white/10 transition-all focus-within:border-white/30"
          style={{ backgroundColor: THEME.colors.surface }}
        >
          {/* Date Picker Trigger */}
          <div className="relative z-999">
           <DatePicker className="z-999"
              selected={startDate}
              onChange={(update) => {
                setDateRange(update);
              }}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              customInput={<CustomDateInput isActive={!!startDate} />}
              isClearable={true}
              shouldCloseOnSelect={false} // Keep open to pick range
              calendarClassName="custom-datepicker-calendar"
            />
          </div>

          {/* Text Input */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your finances..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm md:text-base"
          />

          {/* Send Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!inputValue && !startDate}
            className={`p-3 rounded-full transition-all ${
              inputValue || startDate
                ? "opacity-100 cursor-pointer"
                : "opacity-50 cursor-not-allowed"
            }`}
            style={{
              backgroundColor: inputValue || startDate ? THEME.colors.lime : "#333",
              color: inputValue || startDate ? "#000" : "#888",
            }}
          >
            <Send size={20} />
          </motion.button>
        </div>
      </footer>
      
      {/* DatePicker Styles (Same as ExpenseDataCard for consistency) */}
      <style jsx global>{`
        .custom-datepicker-calendar {
          font-family: inherit !important;
          background-color: #1C1C1E !important;
          border: 1px solid #333 !important;
          border-radius: 12px !important;
          padding: 10px !important;
        }
        .react-datepicker__header {
          background-color: transparent !important;
          border-bottom: 1px solid #333 !important;
        }
        .react-datepicker__current-month {
          color: white !important;
        }
        .react-datepicker__day {
          color: #9CA3AF !important; 
        }
        .react-datepicker__day:hover {
          background-color: #333 !important;
          color: white !important;
        }
        .react-datepicker__day--selected, 
        .react-datepicker__day--in-range,
        .react-datepicker__day--in-selecting-range {
          background-color: #D8EFA8 !important;
          color: black !important;
        }
        .react-datepicker__day--range-start,
        .react-datepicker__day--range-end {
           background-color: #D8EFA8 !important;
           color: black !important;
           font-weight: bold !important;
        }
        .react-datepicker__triangle {
          display: none !important;
        }
      `}</style>
    </div>
  );
}