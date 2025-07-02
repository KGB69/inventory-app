import React, { useState, useEffect } from 'react';
import { InventoryItem } from '../types';
import { X, Package, PlusCircle } from 'lucide-react';

interface NewPurchaseModalProps {
  inventory: InventoryItem[];
  onClose: () => void;
  onConfirm: (data: { id?: string; name: string; quantity: number; purchasePrice: number; sellingPrice: number; isNew: boolean }) => void;
}

const NewPurchaseModal: React.FC<NewPurchaseModalProps> = ({ inventory, onClose, onConfirm }) => {
  const [isNew, setIsNew] = useState(true);
  const [selectedId, setSelectedId] = useState('');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');

  useEffect(() => {
    if (!isNew && selectedId) {
      const item = inventory.find(i => i.id === selectedId);
      if (item) {
        setName(item.name);
        setPurchasePrice(String(item.purchasePrice));
        setSellingPrice(String(item.sellingPrice));
      }
    } else {
        setName('');
        setPurchasePrice('');
        setSellingPrice('');
    }
  }, [isNew, selectedId, inventory]);

  const handleSubmit = () => {
    const numQuantity = parseInt(quantity, 10);
    const numPurchasePrice = parseFloat(purchasePrice);
    const numSellingPrice = parseFloat(sellingPrice);

    if (name.trim() && !isNaN(numQuantity) && numQuantity > 0 && !isNaN(numPurchasePrice) && numPurchasePrice >= 0 && !isNaN(numSellingPrice) && numSellingPrice >= 0) {
      onConfirm({
        id: isNew ? undefined : selectedId,
        name,
        quantity: numQuantity,
        purchasePrice: numPurchasePrice,
        sellingPrice: numSellingPrice,
        isNew,
      });
    }
  };
  
  const canSubmit = name.trim() && quantity && purchasePrice && sellingPrice;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-brand-secondary p-8 rounded-lg shadow-2xl w-full max-w-md relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-brand-light hover:text-brand-text"><X size={24} /></button>
        <h2 className="text-2xl font-bold mb-6 flex items-center"><Package className="mr-3" />Log a New Purchase</h2>

        <div className="flex items-center space-x-4 mb-6 bg-brand-accent p-1 rounded-lg">
            <button onClick={() => setIsNew(true)} className={`flex-1 py-2 rounded-md transition-colors ${isNew ? 'bg-brand-light text-brand-primary font-semibold' : 'hover:bg-brand-secondary'}`}>New Item</button>
            <button onClick={() => setIsNew(false)} className={`flex-1 py-2 rounded-md transition-colors ${!isNew ? 'bg-brand-light text-brand-primary font-semibold' : 'hover:bg-brand-secondary'}`}>Restock Item</button>
        </div>
        
        <div className="space-y-4">
            {isNew ? (
                 <input type="text" placeholder="Item Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-brand-accent border-brand-light p-2 rounded-md" />
            ) : (
                <select value={selectedId} onChange={e => setSelectedId(e.target.value)} className="w-full bg-brand-accent border-brand-light p-2 rounded-md">
                    <option value="">Select item to restock...</option>
                    {inventory.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
            )}

            <input type="number" placeholder="Quantity Purchased" value={quantity} onChange={e => setQuantity(e.target.value)} min="1" className="w-full bg-brand-accent border-brand-light p-2 rounded-md" />
            <div className="flex gap-4">
                <input type="number" placeholder="Purchase Price (per item)" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)} min="0" step="0.01" className="w-1/2 bg-brand-accent border-brand-light p-2 rounded-md" />
                <input type="number" placeholder="Selling Price (per item)" value={sellingPrice} onChange={e => setSellingPrice(e.target.value)} min="0" step="0.01" className="w-1/2 bg-brand-accent border-brand-light p-2 rounded-md" readOnly={!isNew} />
            </div>
        </div>

        <button onClick={handleSubmit} disabled={!canSubmit} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors mt-8 disabled:bg-blue-800 disabled:cursor-not-allowed">
          <PlusCircle size={20} className="inline mr-2" /> Confirm Purchase
        </button>
      </div>
    </div>
  );
};

export default NewPurchaseModal;
