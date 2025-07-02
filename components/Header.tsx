import React from 'react';
import { DollarSign, PlusCircle, MinusCircle, ShoppingCart, Download } from 'lucide-react';

interface HeaderProps {
    onNewSaleClick: () => void;
    onNewPurchaseClick: () => void;
    onNewExpenseClick: () => void;
    onDownloadPdf: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewSaleClick, onNewPurchaseClick, onNewExpenseClick, onDownloadPdf }) => {
  return (
    <header className="bg-brand-secondary shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <DollarSign size={36} className="text-brand-light" />
          <h1 className="text-2xl md:text-3xl font-bold text-brand-text tracking-tight">
            Shop Ledger Pro
          </h1>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4 flex-wrap justify-center">
            <button onClick={onNewSaleClick} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center transition-colors duration-300 shadow-md">
                <ShoppingCart size={18} className="mr-2" /> New Sale
            </button>
             <button onClick={onNewPurchaseClick} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center transition-colors duration-300 shadow-md">
                <PlusCircle size={18} className="mr-2" /> New Purchase
            </button>
             <button onClick={onNewExpenseClick} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center transition-colors duration-300 shadow-md">
                <MinusCircle size={18} className="mr-2" /> New Expense
            </button>
             <button onClick={onDownloadPdf} className="bg-brand-accent hover:bg-brand-light text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center transition-colors duration-300 shadow-md">
                <Download size={18} className="mr-2" /> Download Report
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;