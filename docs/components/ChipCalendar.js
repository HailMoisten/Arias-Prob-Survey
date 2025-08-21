import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
const ChipCalendar = ({ history }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };
    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };
    const dailyChanges = useMemo(() => {
        const sortedHistory = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const changes = new Map();
        sortedHistory.forEach((day, index) => {
            const prevChips = index > 0 ? sortedHistory[index - 1].chips : 0;
            const change = day.chips - prevChips;
            changes.set(day.date, change);
        });
        return changes;
    }, [history]);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startingDay = firstDayOfMonth.getDay();
    const days = [];
    for (let i = 0; i < startingDay; i++) {
        days.push(jsx("div", { className: "border-r border-b border-yellow-100" }, `empty-start-${i}`));
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(Date.UTC(year, month, day));
        const dateString = date.toISOString().split('T')[0];
        const change = dailyChanges.get(dateString);
        let changeText = null;
        if (change !== undefined) {
            const isPositive = change > 0;
            const isNegative = change < 0;
            changeText = (jsxs("span", { className: `text-[9px] font-bold ${isPositive ? 'text-green-500' : ''} ${isNegative ? 'text-red-500' : ''}`, children: [isPositive ? '+' : '', change] }));
        }
        const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
        days.push(
        // ▼ カレンダーの日付セルの見た目を調整できます ▼
        jsxs("div", { 
            // 日付セルの高さを調整できます (例: h-7 は 1.75rem / 28px)
            className: "p-1 text-center border-r border-b border-yellow-100 h-9 flex flex-col justify-start items-center", children: [jsx("span", { className: `text-[10px] ${isToday ? 'bg-yellow-400 text-gray-800 rounded-full w-4 h-4 flex items-center justify-center' : 'text-gray-600'}`, children: day }), jsx("div", { className: "mt-0.5", children: changeText })] }, day));
    }
    const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
    return (jsxs("div", { className: "w-full flex flex-col font-jp", children: [jsxs("div", { className: "flex justify-between items-center text-center font-bold text-sm text-orange-600 mb-1", children: [jsx("button", { onClick: handlePrevMonth, className: "p-1 rounded-full hover:bg-yellow-100 transition-colors", "aria-label": "前の月", children: jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }) }), jsx("span", { children: `${year}年 ${month + 1}月` }), jsx("button", { onClick: handleNextMonth, className: "p-1 rounded-full hover:bg-yellow-100 transition-colors", "aria-label": "次の月", children: jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) }) })] }), jsx("div", { className: "grid grid-cols-7 text-[9px] text-center text-gray-500", children: daysOfWeek.map(d => jsx("div", { className: "py-1", children: d }, d)) }), jsx("div", { className: "grid grid-cols-7 flex-grow bg-white rounded-b-lg border border-yellow-100", children: days })] }));
};
export default ChipCalendar;
