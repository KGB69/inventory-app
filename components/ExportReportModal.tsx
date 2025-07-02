import React, { useState } from 'react';
import { X, FileDown, Briefcase, History, Package } from 'lucide-react';

interface ExportOptions {
  summary: boolean;
  transactions: boolean;
  inventory: boolean;
}

interface ExportReportModalProps {
  onClose: () => void;
  onConfirm: (options: ExportOptions) => void;
}

const ExportReportModal: React.FC<ExportReportModalProps> = ({ onClose, onConfirm }) => {
  const [options, setOptions] = useState<ExportOptions>({
    summary: true,
    transactions: true,
    inventory: false,
  });

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setOptions(prev => ({ ...prev, [name as keyof ExportOptions]: checked }));
  };

  const handleConfirm = () => {
    if (options.summary || options.transactions || options.inventory) {
      onConfirm(options);
    } else {
      alert("Please select at least one section to export.");
    }
  };
  
  const canSubmit = options.summary || options.transactions || options.inventory;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="bg-brand-secondary p-8 rounded-lg shadow-2xl w-full max-w-md relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-brand-light hover:text-brand-text transition-colors" aria-label="Close modal">
          <X size={24} />
        </button>
        <h2 id="modal-title" className="text-2xl font-bold mb-6 flex items-center">
            <FileDown className="mr-3" />
            Export Custom Report
        </h2>
        
        <p className="text-brand-light mb-6">Select the sections you want to include in the PDF report. The report will respect the currently active date filters.</p>
        
        <div className="space-y-4">
            <label className="flex items-center p-3 bg-brand-accent rounded-md cursor-pointer hover:bg-brand-accent/70 transition-colors">
                <input type="checkbox" name="summary" checked={options.summary} onChange={handleOptionChange} className="h-5 w-5 rounded bg-brand-secondary text-brand-light focus:ring-brand-light border-brand-light" />
                <Briefcase className="mx-3 text-brand-light" />
                <span className="font-semibold">Financial Summary</span>
            </label>
             <label className="flex items-center p-3 bg-brand-accent rounded-md cursor-pointer hover:bg-brand-accent/70 transition-colors">
                <input type="checkbox" name="transactions" checked={options.transactions} onChange={handleOptionChange} className="h-5 w-5 rounded bg-brand-secondary text-brand-light focus:ring-brand-light border-brand-light" />
                <History className="mx-3 text-brand-light" />
                <span className="font-semibold">Transaction List</span>
            </label>
             <label className="flex items-center p-3 bg-brand-accent rounded-md cursor-pointer hover:bg-brand-accent/70 transition-colors">
                <input type="checkbox" name="inventory" checked={options.inventory} onChange={handleOptionChange} className="h-5 w-5 rounded bg-brand-secondary text-brand-light focus:ring-brand-light border-brand-light" />
                <Package className="mx-3 text-brand-light" />
                <span className="font-semibold">Current Inventory Status</span>
            </label>
        </div>

        <button
          onClick={handleConfirm}
          disabled={!canSubmit}
          className="w-full bg-brand-accent hover:bg-brand-light text-brand-text font-bold py-3 px-4 rounded-md transition-colors duration-300 disabled:bg-brand-accent/50 disabled:cursor-not-allowed mt-8 flex items-center justify-center"
        >
            <FileDown size={18} className="mr-2" />
            Generate & Download
        </button>
      </div>
    </div>
  );
};

export default ExportReportModal;
