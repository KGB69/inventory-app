export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  createdAt: Date;
}

export enum TransactionType {
  SALE = 'Sale',
  PURCHASE = 'Purchase',
  EXPENSE = 'Expense',
  ADJUSTMENT = 'Stock Adjustment',
}

export interface TransactionItem {
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number; // For sales, this is sellingPrice; for purchases, purchasePrice
}

export interface Transaction {
  id: string;
  type: TransactionType;
  timestamp: Date;
  description: string;
  amount: number; // total revenue for sale, total cost for purchase/expense
  cogs?: number; // Cost of Goods Sold, only for SALE transactions
  items?: TransactionItem[];
}

export enum LedgerEntryType {
  IN = 'IN',
  OUT = 'OUT',
  INITIAL = 'INITIAL',
}

export interface LedgerEntry {
  id: string;
  itemName: string;
  timestamp: Date;
  type: LedgerEntryType;
  quantityChange: number;
  newQuantity: number;
}
