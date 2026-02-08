import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { ChevronLeft, FileText, Download, Search, Filter } from 'lucide-react';

interface TransactionHistoryProps {
  onBack?: () => void;
}

const MOCK_TRANSACTIONS = [
  {
    id: '1',
    type: 'activity',
    description: 'Basketball Session - Downtown Court',
    date: '2024-02-03',
    amount: -25.00,
    status: 'completed',
  },
  {
    id: '2',
    type: 'refund',
    description: 'Refund - Yoga Class',
    date: '2024-02-01',
    amount: 15.00,
    status: 'completed',
  },
  {
    id: '3',
    type: 'wallet',
    description: 'Wallet Top-up',
    date: '2024-01-30',
    amount: 100.00,
    status: 'completed',
  },
  {
    id: '4',
    type: 'activity',
    description: 'Swimming Pool - Daily Pass',
    date: '2024-01-28',
    amount: -30.00,
    status: 'completed',
  },
  {
    id: '5',
    type: 'product',
    description: 'Running Shoes Purchase',
    date: '2024-01-25',
    amount: -89.99,
    status: 'completed',
  },
  {
    id: '6',
    type: 'activity',
    description: 'Tennis Court Rental',
    date: '2024-01-20',
    amount: -20.00,
    status: 'pending',
  },
];

export function TransactionHistory({ onBack }: TransactionHistoryProps) {
  const [transactions] = useState(MOCK_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'income' && transaction.amount > 0) ||
      (filterType === 'expense' && transaction.amount < 0);
    return matchesSearch && matchesFilter;
  });

  const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
            <p className="text-sm text-muted-foreground mt-1">
              View all your payments and refunds
            </p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalExpense.toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Total Received</p>
              <p className="text-2xl font-bold text-green-600">
                ${totalIncome.toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Net Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(totalIncome - totalExpense).toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterType('all')}
              className={filterType === 'all' ? 'bg-[#003C66] hover:bg-[#002A4A]' : ''}
            >
              All
            </Button>
            <Button
              variant={filterType === 'income' ? 'default' : 'outline'}
              onClick={() => setFilterType('income')}
              className={filterType === 'income' ? 'bg-[#003C66] hover:bg-[#002A4A]' : ''}
            >
              Income
            </Button>
            <Button
              variant={filterType === 'expense' ? 'default' : 'outline'}
              onClick={() => setFilterType('expense')}
              className={filterType === 'expense' ? 'bg-[#003C66] hover:bg-[#002A4A]' : ''}
            >
              Expense
            </Button>
          </div>
        </div>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#003C66]" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No transactions found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          transaction.amount > 0
                            ? 'bg-green-100'
                            : 'bg-blue-100'
                        }`}
                      >
                        <FileText
                          className={`w-5 h-5 ${
                            transaction.amount > 0
                              ? 'text-green-600'
                              : 'text-[#003C66]'
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {transaction.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                          <Badge
                            variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                            className={
                              transaction.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          transaction.amount > 0
                            ? 'text-green-600'
                            : 'text-gray-900'
                        }`}
                      >
                        {transaction.amount > 0 ? '+' : ''}$
                        {Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {transaction.type}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
