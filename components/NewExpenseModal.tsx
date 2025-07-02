import React, { useState } from 'react';
import { X, Receipt } from 'lucide-react';

interface NewExpenseModalProps {
  onClose: () => void;
  onConfirm: (description: string, amount: number) => void;
}

const NewExpenseModal: React.FC<NewExpenseModalProps> = ({ onClose, onConfirm }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    
    const handleSubmit = () => {
        const numAmount = parseFloat(amount);
        if(description.trim() && !isNaN(numAmount) && numAmount > 0) {
            onConfirm(description.trim(), numAmount);
        }
    };

    const canSubmit = description.trim() && amount;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-brand-secondary p-8 rounded-lg shadow-2xl w-full max-w-md relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-brand-light hover:text-brand-text"><X size={24} /></button>
                <h2 className="text-2xl font-bold mb-6 flex items-center"><Receipt className="mr-3" />Log an Expense</h2>

                <div className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Expense Description (e.g., Rent, Utilities)" 
                        value={description} 
                        onChange={e => setDescription(e.target.value)}
                        className="w-full bg-brand-accent border-brand-light p-2 rounded-md"
                        autoFocus
                    />
                    <input 
                        type="number" 
                        placeholder="Amount" 
                        value={amount} 
                        onChange={e => setAmount(e.target.value)}
                        min="0.01" 
                        step="0.01"
                        className="w-full bg-brand-accent border-brand-light p-2 rounded-md"
                    />
                </div>

                <button 
                    onClick={handleSubmit} 
                    disabled={!canSubmit}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition-colors mt-8 disabled:bg-red-800 disabled:cursor-not-allowed"
                >
                    Add Expense
                </button>
            </div>
        </div>
    );
};

export default NewExpenseModal;
