import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface MonthSelectorProps {
  months: string[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ months, selectedMonth, onMonthChange }) => {
  const currentIndex = months.indexOf(selectedMonth);
  
  const goToPrevious = () => {
    if (currentIndex > 0) {
      onMonthChange(months[currentIndex - 1]);
    }
  };
  
  const goToNext = () => {
    if (currentIndex < months.length - 1) {
      onMonthChange(months[currentIndex + 1]);
    }
  };

  if (months.length === 0) return null;

  return (
    <div className="flex items-center justify-center space-x-4 bg-white rounded-lg shadow-md p-4">
      <button
        onClick={goToPrevious}
        disabled={currentIndex === 0}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        <ChevronLeft size={20} />
      </button>
      
      <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-lg">
        <Calendar size={20} className="text-blue-600" />
        <h2 className="text-xl font-semibold text-blue-800">{selectedMonth}</h2>
      </div>
      
      <button
        onClick={goToNext}
        disabled={currentIndex === months.length - 1}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        <ChevronRight size={20} />
      </button>
      
      <select
        value={selectedMonth}
        onChange={(e) => onMonthChange(e.target.value)}
        className="ml-4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {months.map(month => (
          <option key={month} value={month}>{month}</option>
        ))}
      </select>
    </div>
  );
};

export default MonthSelector;