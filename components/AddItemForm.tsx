
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

interface AddItemFormProps {
  onAddItem: (itemName: string, initialQuantity: number) => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ onAddItem }) => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numQuantity = parseInt(quantity, 10);
    if (itemName.trim() && !isNaN(numQuantity) && numQuantity >= 0) {
      onAddItem(itemName.trim(), numQuantity);
      setItemName('');
      setQuantity('');
    }
  };

  return (
    <div className="bg-brand-secondary p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-brand-text mb-4">Add New Item</h2>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="flex-grow bg-brand-accent border border-brand-light text-brand-text placeholder-brand-light rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-light"
          required
          aria-label="Item Name"
        />
        <input
          type="number"
          placeholder="Initial Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="bg-brand-accent border border-brand-light text-brand-text placeholder-brand-light rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-light w-full md:w-48"
          required
          min="0"
          aria-label="Initial Quantity"
        />
        <button
          type="submit"
          className="bg-brand-accent hover:bg-brand-light text-brand-text font-bold py-2 px-4 rounded-md flex items-center justify-center transition-colors duration-300"
          aria-label="Add Item"
        >
          <PlusCircle size={20} className="mr-2" />
          Add Item
        </button>
      </form>
    </div>
  );
};

export default AddItemForm;
