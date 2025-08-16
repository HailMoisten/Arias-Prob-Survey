import React, { useState, useMemo } from 'react';
import { PlayerState } from '../types';

interface ChipCalendarProps {
  history: PlayerState['chipHistory'];
}

const ChipCalendar: React.FC<ChipCalendarProps> = ({ history }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const dailyChanges = useMemo(() => {
    const sortedHistory = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const changes = new Map<string, number>();
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
    days.push(<div key={`empty-start-${i}`} className="border-r border-b border-yellow-100"></div>);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(Date.UTC(year, month, day));
    const dateString = date.toISOString().split('T')[0];
    const change = dailyChanges.get(dateString);

    let changeText = null;
    if (change !== undefined) {
      const isPositive = change > 0;
      const isNegative = change < 0;
      changeText = (
        <span className={`text-[9px] font-bold ${isPositive ? 'text-green-500' : ''} ${isNegative ? 'text-red-500' : ''}`}>
          {isPositive ? '+' : ''}{change}
        </span>
      );
    }
    
    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

    days.push(
      // ▼ カレンダーの日付セルの見た目を調整できます ▼
      <div 
        key={day} 
        // 日付セルの高さを調整できます (例: h-7 は 1.75rem / 28px)
        className="p-1 text-center border-r border-b border-yellow-100 h-9 flex flex-col justify-start items-center">
        {/* 「今日」の日付を囲む円のサイズを調整できます (例: w-3.5 h-3.5) */}
        <span className={`text-[10px] ${isToday ? 'bg-yellow-400 text-gray-800 rounded-full w-4 h-4 flex items-center justify-center' : 'text-gray-600'}`}>
            {day}
        </span>
        {/* 日付と獲得チップ数の間の縦の余白を調整できます (例: mt-0.5 は 2px) */}
        <div className="mt-0.5">{changeText}</div>
      </div>
    );
  }
  
  const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className="w-full flex flex-col font-jp">
      <div className="flex justify-between items-center text-center font-bold text-sm text-orange-600 mb-1">
        <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-yellow-100 transition-colors" aria-label="前の月">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span>{`${year}年 ${month + 1}月`}</span>
        <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-yellow-100 transition-colors" aria-label="次の月">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-7 text-[9px] text-center text-gray-500">
        {daysOfWeek.map(d => <div key={d} className="py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 flex-grow bg-white rounded-b-lg border border-yellow-100">
        {days}
      </div>
    </div>
  );
};

export default ChipCalendar;