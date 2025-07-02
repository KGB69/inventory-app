import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { X } from 'lucide-react';

interface AdjustStockModalProps {
  item: InventoryItem;
  onClose: () => void;
  onAdjust: (item: InventoryItem, change: number, reason: string) => void;
}

const AdjustStockModal: React.FC<AdjustStockModalProps> = ({ item, onClose, onAdjust }) => {
  const [change, setChange] = useState('');
  const [reason, setReason] = useState('');

  const handleAdjust = () => {
    const numChange = parseInt(change, 10);
    if (!isNaN(numChange) && numChange !== 0 && reason.trim()) {
      if (item.quantity + numChange < 0) {
        alert("Cannot adjust stock to a negative quantity.");
        return;
      }
      onAdjust(item, numChange, reason.trim());
    }
  };

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
        <h2 id="modal-title" className="text-2xl font-bold mb-2">Adjust Stock</h2>
        <p className="text-brand-light mb-6">Item: <span className="font-semibold text-brand-text">{item.name}</span> (Current: {item.quantity})</p>

        <div className="mb-4">
            <label htmlFor="quantity-change" className="block text-sm font-medium text-brand-light mb-2">
                Adjustment Quantity
            </label>
            <input
              id="quantity-change"
              type="number"
              placeholder="e.g., -5 or 10"
              value={change}
              onChange={(e) => setChange(e.target.value)}
              className="w-full bg-brand-accent border border-brand-light text-brand-text placeholder-brand-light rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-light"
              required
              autoFocus
            />
             <p className="text-xs text-brand-light mt-1">Enter a positive number to add stock, a negative number to remove it.</p>
        </div>

        <div className="mb-6">
            <label htmlFor="reason" className="block text-sm font-medium text-brand-light mb-2">
                Reason for Adjustment
            </label>
            <input
              id="reason"
              type="text"
              placeholder="e.g., Stock count correction, Damaged goods"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-brand-accent border border-brand-light text-brand-text placeholder-brand-light rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-light"
              required
            />
        </div>

        <button
          onClick={handleAdjust}
          disabled={!change || !reason.trim() || parseInt(change,10) === 0}
          className="w-full bg-brand-accent hover:bg-brand-light text-brand-text font-bold py-3 px-4 rounded-md transition-colors duration-300 disabled:bg-brand-accent/50 disabled:cursor-not-allowed"
        >
          Confirm Adjustment
        </button>
      </div>
    </div>
  );
};

export default AdjustStockModal;
