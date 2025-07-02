import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { InventoryItem, Transaction, TransactionType } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import InventoryList from './components/InventoryList';
import TransactionList from './components/TransactionList';
import NewSaleModal from './components/NewSaleModal';
import NewPurchaseModal from './components/NewPurchaseModal';
import NewExpenseModal from './components/NewExpenseModal';
import AdjustStockModal from './components/AdjustStockModal';
import ExportReportModal from './components/ExportReportModal';
import FilterControls from './components/FilterControls';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatDate } from './utils/formatters';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(() => {
    try {
      const savedItems = localStorage.getItem('inventoryItems');
      if (savedItems) {
        return JSON.parse(savedItems).map((item: InventoryItem) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        }));
      }
    } catch (error) {
      console.error("Failed to load inventory from localStorage", error);
    }
    return [];
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const savedTransactions = localStorage.getItem('transactions');
      if (savedTransactions) {
        return JSON.parse(savedTransactions).map((txn: Transaction) => ({
          ...txn,
          timestamp: new Date(txn.timestamp),
        }));
      }
    } catch (error) {
      console.error("Failed to load transactions from localStorage", error);
    }
    return [];
  });
  
  const [modal, setModal] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('inventoryItems', JSON.stringify(inventoryItems));
    } catch (error) {
      console.error("Failed to save inventory to localStorage", error);
    }
  }, [inventoryItems]);

  useEffect(() => {
    try {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    } catch (error) {
      console.error("Failed to save transactions to localStorage", error);
    }
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
        const transactionDate = t.timestamp;
        const isAfterStart = !startDate || transactionDate >= startDate;
        
        const endOfDay = endDate ? new Date(endDate) : null;
        if (endOfDay) {
            endOfDay.setHours(23, 59, 59, 999);
        }
        const isBeforeEnd = !endOfDay || transactionDate <= endOfDay;

        return isAfterStart && isBeforeEnd;
    });
  }, [transactions, startDate, endDate]);

  const financialSummary = useMemo(() => {
    const revenue = filteredTransactions
      .filter(t => t.type === TransactionType.SALE)
      .reduce((sum, t) => sum + t.amount, 0);
    const cogs = filteredTransactions
      .filter(t => t.type === TransactionType.SALE)
      .reduce((sum, t) => sum + (t.cogs || 0), 0);
    const operatingExpenses = filteredTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    const purchases = filteredTransactions
      .filter(t => t.type === TransactionType.PURCHASE)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalOutflows = operatingExpenses + purchases;
    const grossProfit = revenue - cogs;
    const netProfit = grossProfit - operatingExpenses;

    return { revenue, cogs, totalOutflows, grossProfit, netProfit, operatingExpenses };
  }, [filteredTransactions]);
  
  const handleOpenModal = (modalName: string, item: InventoryItem | null = null) => {
    setSelectedItem(item);
    setModal(modalName);
  };

  const handleCloseModal = () => {
    setModal(null);
    setSelectedItem(null);
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    setTransactions(prev => [{ ...transaction, id: `txn-${Date.now()}`, timestamp: new Date() }, ...prev]);
  };

  const handleNewSale = useCallback((saleItems: { item: InventoryItem; quantity: number }[]) => {
    const totalRevenue = saleItems.reduce((sum, si) => sum + si.item.sellingPrice * si.quantity, 0);
    const totalCogs = saleItems.reduce((sum, si) => sum + si.item.purchasePrice * si.quantity, 0);

    addTransaction({
      type: TransactionType.SALE,
      description: `Sale of ${saleItems.length} item types`,
      amount: totalRevenue,
      cogs: totalCogs,
      items: saleItems.map(si => ({
        itemId: si.item.id,
        itemName: si.item.name,
        quantity: si.quantity,
        unitPrice: si.item.sellingPrice,
      })),
    });

    setInventoryItems(prevItems => {
      const newItems = [...prevItems];
      saleItems.forEach(si => {
        const itemIndex = newItems.findIndex(i => i.id === si.item.id);
        if (itemIndex > -1) {
          newItems[itemIndex].quantity -= si.quantity;
        }
      });
      return newItems;
    });

    handleCloseModal();
  }, []);

  const handleNewPurchase = useCallback((data: { id?: string; name: string; quantity: number; purchasePrice: number; sellingPrice: number; isNew: boolean }) => {
    const { id, name, quantity, purchasePrice, sellingPrice, isNew } = data;
    const amount = purchasePrice * quantity;
    let itemId = id || `item-${Date.now()}`;

    if (isNew) {
      const newItem: InventoryItem = { id: itemId, name, quantity, purchasePrice, sellingPrice, createdAt: new Date() };
      setInventoryItems(prev => [...prev, newItem]);
    } else {
      setInventoryItems(prev => prev.map(item => item.id === id ? { ...item, quantity: item.quantity + quantity, purchasePrice } : item));
    }
    
    addTransaction({
      type: TransactionType.PURCHASE,
      description: `Purchased ${name}`,
      amount,
      items: [{ itemId, itemName: name, quantity, unitPrice: purchasePrice }],
    });

    handleCloseModal();
  }, []);

  const handleNewExpense = useCallback((description: string, amount: number) => {
    addTransaction({ type: TransactionType.EXPENSE, description, amount });
    handleCloseModal();
  }, []);

  const handleAdjustStock = useCallback((item: InventoryItem, change: number, reason: string) => {
    const changeAmount = change > 0 ? `+${change}` : `${change}`;
    addTransaction({
      type: TransactionType.ADJUSTMENT,
      description: `Adjusted ${item.name} by ${changeAmount}. Reason: ${reason}`,
      amount: 0,
      items: [{ itemId: item.id, itemName: item.name, quantity: change, unitPrice: 0 }],
    });

    setInventoryItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + change } : i));
    handleCloseModal();
  }, []);

  const handleGenerateCustomReport = useCallback((options: { summary: boolean; transactions: boolean; inventory: boolean }) => {
    const doc = new jsPDF();
    let yPos = 22;

    doc.setFontSize(18);
    doc.text('Custom Report', 14, yPos);
    yPos += 6;
    doc.setFontSize(11);
    doc.setTextColor(100);
    const dateRange = (startDate ? `From: ${formatDate(startDate)}` : '') + (endDate ? ` To: ${formatDate(endDate)}` : '');
    doc.text(dateRange || 'Showing all available data', 14, yPos);
    yPos += 10;

    if (options.summary) {
        doc.setFontSize(14);
        doc.text('Financial Summary', 14, yPos);
        yPos += 7;
        autoTable(doc, {
            body: [
                ['Total Revenue', formatCurrency(financialSummary.revenue)],
                ['Cost of Goods Sold (COGS)', formatCurrency(financialSummary.cogs)],
                ['Gross Profit', formatCurrency(financialSummary.grossProfit)],
                ['Operating Expenses', formatCurrency(financialSummary.operatingExpenses)],
                ['Net Profit', formatCurrency(financialSummary.netProfit)],
            ],
            startY: yPos,
            theme: 'striped',
            headStyles: { fillColor: [27, 38, 59] },
        });
        yPos = (doc as any).lastAutoTable.finalY + 10;
    }

    if (options.transactions && filteredTransactions.length > 0) {
        doc.setFontSize(14);
        doc.text('Transaction List', 14, yPos);
        yPos += 7;
        const tableData = filteredTransactions.map(t => [
            formatDate(t.timestamp),
            t.type,
            t.description,
            t.amount === 0 ? '-' : (t.type === TransactionType.SALE ? `+${formatCurrency(t.amount)}` : `-${formatCurrency(t.amount)}`),
        ]);
        autoTable(doc, {
            head: [['Date', 'Type', 'Description', 'Amount']],
            body: tableData,
            startY: yPos,
            theme: 'grid',
            headStyles: { fillColor: [27, 38, 59] },
        });
        yPos = (doc as any).lastAutoTable.finalY + 10;
    }

    if (options.inventory && inventoryItems.length > 0) {
        doc.setFontSize(14);
        doc.text('Current Inventory Status', 14, yPos);
        yPos += 7;
        const inventoryData = inventoryItems.map(i => [
            i.name,
            i.quantity,
            formatCurrency(i.purchasePrice),
            formatCurrency(i.sellingPrice),
        ]);
        autoTable(doc, {
            head: [['Item Name', 'Quantity', 'Purchase Price', 'Selling Price']],
            body: inventoryData,
            startY: yPos,
            theme: 'grid',
            headStyles: { fillColor: [27, 38, 59] },
        });
    }

    doc.save(`Shop-Ledger-Report-${formatDate(new Date())}.pdf`);
    handleCloseModal();
  }, [financialSummary, filteredTransactions, inventoryItems, startDate, endDate]);

  const renderTabContent = () => {
    switch(activeTab) {
      case 'inventory':
        return <InventoryList items={inventoryItems} onAdjustStock={(item) => handleOpenModal('adjust', item)} />;
      case 'transactions':
        return <TransactionList transactions={filteredTransactions} />;
      case 'dashboard':
      default:
        return <Dashboard summary={financialSummary} />;
    }
  }

  return (
    <div className="min-h-screen bg-brand-primary font-sans">
      <Header 
        onNewSaleClick={() => handleOpenModal('sale')}
        onNewPurchaseClick={() => handleOpenModal('purchase')}
        onNewExpenseClick={() => handleOpenModal('expense')}
        onDownloadPdf={() => handleOpenModal('export')}
      />
      <main className="container mx-auto p-4 md:p-8">
        <div className="mb-6">
          <div className="border-b border-brand-accent flex justify-between items-center">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              {['dashboard', 'inventory', 'transactions'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`${
                    activeTab === tab
                      ? 'border-brand-light text-brand-text'
                      : 'border-transparent text-brand-light hover:text-brand-text hover:border-gray-500'
                  } capitalize whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        <FilterControls 
          startDate={startDate} 
          endDate={endDate} 
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />

        <div className="mt-8">
          {renderTabContent()}
        </div>
      </main>

      {modal === 'sale' && <NewSaleModal inventory={inventoryItems} onClose={handleCloseModal} onConfirm={handleNewSale} />}
      {modal === 'purchase' && <NewPurchaseModal inventory={inventoryItems} onClose={handleCloseModal} onConfirm={handleNewPurchase} />}
      {modal === 'expense' && <NewExpenseModal onClose={handleCloseModal} onConfirm={handleNewExpense} />}
      {modal === 'adjust' && selectedItem && <AdjustStockModal item={selectedItem} onClose={handleCloseModal} onAdjust={handleAdjustStock} />}
      {modal === 'export' && <ExportReportModal onClose={handleCloseModal} onConfirm={handleGenerateCustomReport} />}
    </div>
  );
};

export default App;