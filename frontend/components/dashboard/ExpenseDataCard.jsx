"use client";

import React, { useState, useEffect, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format, endOfMonth } from 'date-fns';
import { itemVariants } from './variants';

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

const MOCK_DATA = {}; // Deprecated: MOCK_DATA removed in favor of real API

/* 
 * Replaced static MOCK_DATA with API Integration.
 * The component now fetches real transaction stats from /api/transactions/stats
 */


const ExpenseDataCard = ({
    title = "Expense Data",
    subtitle = "Monthly",
    footerDate
}) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState({
        amount: "₹0",
        trend: { value: 0, isIncrease: false, isPositive: true },
        data: [], 
        footerLabel: "Total Month",
        hasData: false
    });

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            try {
                const year = selectedDate.getFullYear();
                const month = selectedDate.getMonth() + 1;
                
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions/stats?month=${month}&year=${year}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    
                    // Process daily stats into 7 bars for the chart
                    // Input: Array of ~30 numbers (daily totals)
                    // Output: Array of 7 numbers (percentages 0-100)
                    const daily = data.dailyStats || [];
                    const chunks = 7;
                    const chunkSize = Math.ceil(daily.length / chunks);
                    const aggregated = [];
                    
                    for (let i = 0; i < chunks; i++) {
                        const start = i * chunkSize;
                        const end = start + chunkSize;
                        const chunkSum = daily.slice(start, end).reduce((a, b) => a + b, 0);
                        aggregated.push(chunkSum);
                    }

                    const maxVal = Math.max(...aggregated);
                    const normalizedData = maxVal > 0 
                        ? aggregated.map(v => Math.round((v / maxVal) * 100))
                        : new Array(7).fill(0);

                    setStats({
                        amount: `₹${data.totalSpent}`,
                        trend: {
                            value: parseFloat(data.trend.value),
                            isIncrease: data.trend.isIncrease,
                            isPositive: data.trend.isPositive
                        },
                        data: normalizedData,
                        footerLabel: "Monthly Overview",
                        hasData: true
                    });
                } else {
                    console.error("Failed to fetch stats");
                    setStats(prev => ({ ...prev, hasData: false }));
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
                setStats(prev => ({ ...prev, hasData: false }));
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [selectedDate]);

    const { amount, trend, data, hasData, footerLabel } = stats;

    const displayedFooterDate = footerDate || (hasData ? `1 - ${format(endOfMonth(selectedDate), "d MMM'yy")}` : "");

    return (
        <motion.div variants={itemVariants} className="bg-[#1C1C1E] p-6 rounded-3xl col-span-1 lg:col-span-2 relative">
             {isLoading && (
                <div className="absolute inset-0 bg-black/20 z-10 rounded-3xl backdrop-blur-[1px]" />
            )}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
                </div>
                
                {/* Date Picker Integration */}
                <div className="relative z-20">
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="MMM yy"
                        showMonthYearPicker
                        maxDate={new Date()}
                        customInput={<CustomDateInput />}
                        calendarClassName="custom-datepicker-calendar"
                    />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                    <div className="text-4xl font-bold text-white">{amount}</div>
                    {hasData && (
                        <div className={`text-sm font-bold flex items-center mt-1 ${trend.isPositive ? 'text-[#D8EFA8]' : 'text-[#FF6B6B]'}`}>
                            {trend.value}% 
                            {trend.isIncrease ? (
                                <ChevronUp size={14} className="ml-1" />
                            ) : (
                                <ChevronDown size={14} className="ml-1" />
                            )}
                        </div>
                    )}
                </div>

                {/* Custom Bar Chart Visualization */}
                <div className="flex-1 h-32 flex items-end justify-between gap-2">
                    {hasData ? (
                        data.map((height, i) => (
                            <div key={i} className="w-full flex flex-col justify-end gap-2 h-full group">
                                <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${height}%` }}
                                    transition={{ duration: 0.8, delay: i * 0.1 }}
                                    className={`w-full rounded-t-lg ${i === 3 ? 'bg-[#CDC9EF]' : i % 2 === 0 ? 'bg-[#D8EFA8]' : 'bg-[#D8EFA8]/50'}`}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                            No chart data
                        </div>
                    )}
                </div>
            </div>
             <div className="flex justify-between text-xs text-gray-500 mt-4 px-2">
                <span>{displayedFooterDate}</span>
                <span>{footerLabel}</span>
            </div>
            
            {/* Global Style Override using styled-jsx for better encapsulation and control */}
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
        </motion.div>
    );
};

export default ExpenseDataCard;
