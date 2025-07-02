import React from 'react';
import { Transaction, TransactionType } from '../types';
import { ShoppingCart, Package, Receipt, Wrench, Inbox } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionIcon: React.FC<{ type: TransactionType }> = ({ type }) => {
  const iconProps = { size: 24, className: 'flex-shrink-0' };
  switch (type) {
    case TransactionType.SALE:
      return <ShoppingCart {...iconProps} className="text-green-400" />;
    case TransactionType.PURCHASE:
      return <Package {...iconProps} className="text-blue-400" />;
    case TransactionType.EXPENSE:
      return <Receipt {...iconProps} className="text-red-400" />;
    case TransactionType.ADJUSTMENT:
      return <Wrench {...iconProps} className="text-yellow-400" />;
    default:
      return null;
  }
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div className="bg-brand-secondary p-8 rounded-lg shadow-lg text-center">
        <Inbox size={48} className="mx-auto text-brand-light mb-4" />
        <h2 className="text-xl font-semibold text-brand-text">No Transactions Yet</h2>
        <p className="text-brand-light">Your sales, purchases, and expenses will appear here.</p>
      </div>
    );
  }

  return (
    <div className="bg-brand-secondary p-4 md:p-6 rounded-lg shadow-lg">
       <div className="flow-root">
        <ul role="list" className="-mb-8">
            {transactions.map((transaction, transactionIdx) => (
            <li key={transaction.id}>
                <div className="relative pb-8">
                {transactionIdx !== transactions.length - 1 ? (
                    <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-brand-accent" aria-hidden="true" />
                ) : null}
                <div className="relative flex items-start space-x-4">
                    <div>
                        <div className="relative px-1">
                            <div className="flex h-8 w-8 bg-brand-accent rounded-full ring-8 ring-brand-secondary items-center justify-center">
                               <TransactionIcon type={transaction.type} />
                            </div>
                        </div>
                    </div>
                    <div className="min-w-0 flex-1 py-1.5">
                        <div className="text-sm text-brand-light">
                            <span className="font-medium text-brand-text">{transaction.type}</span> on {' '}
                            <time dateTime={transaction.timestamp.toISOString()}>
                               {new Date(transaction.timestamp).toLocaleString()}
                            </time>
                        </div>
                        <p className="mt-1 text-base text-brand-text">{transaction.description}</p>
                    </div>
                     <div className="flex-shrink-0 self-center text-right">
                         {transaction.amount > 0 && 
                            <p className={`text-lg font-bold font-mono ${transaction.type === TransactionType.SALE ? 'text-green-400' : 'text-red-400'}`}>
                                {transaction.type === TransactionType.SALE ? '+' : '-'}
                                {formatCurrency(transaction.amount)}
                            </p>
                         }
                    </div>
                </div>
                </div>
            </li>
            ))}
        </ul>
       </div>
    </div>
  );
};

export default TransactionList;
