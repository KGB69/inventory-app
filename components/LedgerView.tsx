
import React from 'react';
import { LedgerEntry, LedgerEntryType } from '../types';
import { ArrowDownLeft, ArrowUpRight, FilePlus, Inbox } from 'lucide-react';

interface LedgerViewProps {
  entries: LedgerEntry[];
}

const LedgerView: React.FC<LedgerViewProps> = ({ entries }) => {
  const getEntryIcon = (type: LedgerEntryType) => {
    switch (type) {
      case LedgerEntryType.IN:
        return <ArrowUpRight size={20} className="text-green-400 flex-shrink-0" />;
      case LedgerEntryType.OUT:
        return <ArrowDownLeft size={20} className="text-red-400 flex-shrink-0" />;
      case LedgerEntryType.INITIAL:
        return <FilePlus size={20} className="text-blue-400 flex-shrink-0" />;
      default:
        return null;
    }
  };

  const getQuantityChangeText = (entry: LedgerEntry) => {
    switch (entry.type) {
      case LedgerEntryType.IN:
        return `+${entry.quantityChange}`;
      case LedgerEntryType.OUT:
        return `-${entry.quantityChange}`;
      case LedgerEntryType.INITIAL:
        return `+${entry.quantityChange}`;
      default:
        return '';
    }
  };

  return (
    <div className="bg-brand-secondary p-6 rounded-lg shadow-lg h-full max-h-[calc(100vh-12rem)] flex flex-col">
      <h2 className="text-xl font-semibold text-brand-text mb-4">Transaction Ledger</h2>
      {entries.length === 0 ? (
        <div className="flex-grow flex items-center justify-center text-center">
            <div>
                <Inbox size={48} className="mx-auto text-brand-light mb-4" />
                <p className="text-brand-light">No transactions yet.</p>
            </div>
        </div>
      ) : (
        <ul className="space-y-3 overflow-y-auto pr-2">
          {entries.map((entry) => (
            <li key={entry.id} className="flex items-center justify-between p-3 bg-brand-accent rounded-md">
              <div className="flex items-center space-x-3 overflow-hidden">
                {getEntryIcon(entry.type)}
                <div className="overflow-hidden">
                  <p className="font-semibold truncate" title={entry.itemName}>{entry.itemName}</p>
                  <p className="text-xs text-brand-light">
                    {new Date(entry.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <p className={`font-mono font-bold text-lg ${entry.type === LedgerEntryType.OUT ? 'text-red-400' : 'text-green-400'}`}>
                  {getQuantityChangeText(entry)}
                </p>
                <p className="text-sm text-brand-light">New Qty: {entry.newQuantity}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LedgerView;
