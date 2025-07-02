import React, { useState, useMemo, useEffect, useRef } from 'react';
import { InventoryItem } from '../types';
import { X, ShoppingCart, Plus, Minus, Trash2, Search } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface NewSaleModalProps {
  inventory: InventoryItem[];
  onClose: () => void;
  onConfirm: (saleItems: { item: InventoryItem; quantity: number }[]) => void;
}

interface SaleItem {
  item: InventoryItem;
  quantity: number;
}

const NewSaleModal: React.FC<NewSaleModalProps> = ({ inventory, onClose, onConfirm }) => {
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery) {
      return [];
    }
    return inventory.filter(item =>
      item.quantity > 0 &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, inventory]);

  const handleAddItemToCart = (itemToAdd: InventoryItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(ci => ci.item.id === itemToAdd.id);
      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + 1, itemToAdd.quantity);
        return prevCart.map(ci =>
          ci.item.id === itemToAdd.id ? { ...ci, quantity: newQuantity } : ci
        );
      } else {
        return [...prevCart, { item: itemToAdd, quantity: 1 }];
      }
    });
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  const handleQuantityChange = (itemId: string, change: number) => {
    setCart(prevCart => {
      const itemToUpdate = prevCart.find(ci => ci.item.id === itemId);
      if (!itemToUpdate) return prevCart;

      const newQuantity = itemToUpdate.quantity + change;

      if (newQuantity <= 0) {
        return prevCart.filter(ci => ci.item.id !== itemId);
      }
      
      const newClampedQuantity = Math.min(newQuantity, itemToUpdate.item.quantity);
      return prevCart.map(ci =>
        ci.item.id === itemId ? { ...ci, quantity: newClampedQuantity } : ci
      );
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setCart(prevCart => prevCart.filter(ci => ci.item.id !== itemId));
  };
  
  const totalSaleAmount = useMemo(() => {
    return cart.reduce((total, si) => total + si.item.sellingPrice * si.quantity, 0);
  }, [cart]);

  const handleConfirm = () => {
    if (cart.length > 0) {
      onConfirm(cart);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-brand-secondary p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-4xl relative flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-brand-light hover:text-brand-text transition-colors" aria-label="Close modal"><X size={24} /></button>
        <h2 className="text-2xl font-bold mb-6 flex items-center flex-shrink-0"><ShoppingCart className="mr-3" />Record a New Sale</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 flex-grow min-h-0">
          {/* Left Side: Search and Results */}
          <div className="flex flex-col">
            <div className="relative mb-4 flex-shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for products to add..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-brand-accent border border-brand-light text-brand-text placeholder-brand-light rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-light"
              />
            </div>
            <div className="overflow-y-auto pr-2">
              {searchResults.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleAddItemToCart(item)}
                  className="flex items-center justify-between w-full text-left p-3 rounded-md hover:bg-brand-accent transition-colors"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-brand-light">{formatCurrency(item.sellingPrice)}</p>
                  </div>
                  <div className="text-right">
                      <p className="text-sm text-brand-light">In Stock</p>
                      <p className="font-semibold">{item.quantity}</p>
                  </div>
                </button>
              ))}
              {searchQuery && searchResults.length === 0 && (
                <p className="text-center text-brand-light p-4">No products found.</p>
              )}
            </div>
          </div>

          {/* Right Side: Cart */}
          <div className="flex flex-col bg-brand-primary/50 p-4 rounded-lg mt-4 md:mt-0">
            <h3 className="text-lg font-semibold mb-3 flex-shrink-0">Current Sale</h3>
            <div className="flex-grow space-y-3 overflow-y-auto pr-2">
              {cart.map(({ item, quantity }) => (
                <div key={item.id} className="flex items-center p-2 bg-brand-accent rounded-md">
                  <div className="flex-grow">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-brand-light">{formatCurrency(item.sellingPrice)} &times; {quantity} = <span className="font-medium text-brand-text">{formatCurrency(item.sellingPrice * quantity)}</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleQuantityChange(item.id, -1)} className="p-1 rounded-full bg-brand-secondary hover:bg-brand-light transition-colors"><Minus size={16} /></button>
                    <span className="w-8 text-center font-mono">{quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, 1)} disabled={quantity >= item.quantity} className="p-1 rounded-full bg-brand-secondary hover:bg-brand-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"><Plus size={16} /></button>
                    <button onClick={() => handleRemoveItem(item.id)} className="ml-2 text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
              {cart.length === 0 && <p className="text-brand-light text-center py-8">Search for items to add them to the sale.</p>}
            </div>
            <div className="border-t border-brand-accent pt-4 mt-4 flex justify-between items-center flex-shrink-0">
              <div>
                <p className="text-lg text-brand-light">Total</p>
                <p className="text-3xl font-bold text-green-400">{formatCurrency(totalSaleAmount)}</p>
              </div>
              <button
                onClick={handleConfirm}
                disabled={cart.length === 0}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md transition-colors duration-300 disabled:bg-green-800 disabled:cursor-not-allowed"
              >
                Confirm Sale
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSaleModal;
