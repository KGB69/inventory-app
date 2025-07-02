import React from 'react';
import { Calendar, XCircle } from 'lucide-react';
import { formatDate } from '../utils/formatters';

interface FilterControlsProps {
    startDate: Date | null;
    endDate: Date | null;
    onStartDateChange: (date: Date | null) => void;
    onEndDateChange: (date: Date | null) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {

    const handleReset = () => {
        onStartDateChange(null);
        onEndDateChange(null);
    };

    return (
        <div className="bg-brand-secondary p-4 rounded-lg shadow-lg flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-2">
                <Calendar className="text-brand-light" size={20}/>
                <h3 className="text-lg font-semibold text-brand-text">Filter by Date</h3>
            </div>
            <div className="flex-grow flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full sm:w-auto">
                    <label htmlFor="start-date" className="sr-only">Start Date</label>
                    <input
                        id="start-date"
                        type="date"
                        value={startDate ? formatDate(startDate) : ''}
                        onChange={(e) => onStartDateChange(e.target.value ? new Date(e.target.value) : null)}
                        className="bg-brand-accent border border-brand-light text-brand-text placeholder-brand-light rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-light w-full"
                    />
                </div>
                <span className="text-brand-light hidden sm:block">-</span>
                <div className="w-full sm:w-auto">
                     <label htmlFor="end-date" className="sr-only">End Date</label>
                    <input
                        id="end-date"
                        type="date"
                        value={endDate ? formatDate(endDate) : ''}
                        onChange={(e) => onEndDateChange(e.target.value ? new Date(e.target.value) : null)}
                        className="bg-brand-accent border border-brand-light text-brand-text placeholder-brand-light rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-light w-full"
                    />
                </div>
            </div>
             <button
                onClick={handleReset}
                className="bg-brand-accent hover:bg-brand-light text-brand-text font-bold py-2 px-4 rounded-md flex items-center justify-center transition-colors duration-300"
                aria-label="Reset date filters"
            >
                <XCircle size={18} className="mr-2" />
                Reset
            </button>
        </div>
    );
};

export default FilterControls;
