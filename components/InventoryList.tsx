import React from 'react';
import { InventoryItem } from '../types';
import { Edit, Package } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';


interface InventoryListProps {
  items: InventoryItem[];
  onAdjustStock: (item: InventoryItem) => void;
}

const InventoryList: React.FC<InventoryListProps> = ({ items, onAdjustStock }) => {
  if (items.length === 0) {
    return (
      <div className="bg-brand-secondary p-8 rounded-lg shadow-lg text-center">
        <Package size={48} className="mx-auto text-brand-light mb-4" />
        <h2 className="text-xl font-semibold text-brand-text mb-2">Your Inventory is Empty</h2>
        <p className="text-brand-light">Use the "New Purchase" button to add your first item.</p>
      </div>
    );
  }

  return (
    <div className="bg-brand-secondary p-4 md:p-6 rounded-lg shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-brand-accent">
              <th className="p-3 text-brand-light font-semibold">Item Name</th>
              <th className="p-3 text-brand-light font-semibold text-center">Quantity</th>
              <th className="p-3 text-brand-light font-semibold text-right">Purchase Price</th>
              <th className="p-3 text-brand-light font-semibold text-right">Selling Price</th>
              <th className="p-3 text-brand-light font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-brand-accent last:border-b-0 hover:bg-brand-accent/50 transition-colors">
                <td className="p-3 font-medium">{item.name}</td>
                <td className="p-3 text-center font-mono text-lg">{item.quantity}</td>
                <td className="p-3 text-right font-mono">{formatCurrency(item.purchasePrice)}</td>
                <td className="p-3 text-right font-mono">{formatCurrency(item.sellingPrice)}</td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => onAdjustStock(item)}
                    className="bg-brand-accent hover:bg-brand-light text-brand-text font-bold py-1 px-3 rounded-md flex items-center ml-auto transition-colors duration-300"
                    aria-label={`Adjust stock for ${item.name}`}
                  >
                    <Edit size={16} className="mr-2" />
                    Adjust
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryList;
