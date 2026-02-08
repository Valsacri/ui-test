import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { 
  ChevronLeft, 
  Wallet, 
  Plus, 
  Minus, 
  ArrowUpRight, 
  ArrowDownLeft,
  DollarSign,
  CreditCard,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

interface WalletBalanceProps {
  onBack?: () => void;
}

const RECENT_TRANSACTIONS = [
  {
    id: '1',
    type: 'credit',
    description: 'Wallet Top-up',
    amount: 100.00,
    date: '2024-02-03',
    status: 'completed',
  },
  {
    id: '2',
    type: 'debit',
    description: 'Basketball Session Payment',
    amount: -25.00,
    date: '2024-02-02',
    status: 'completed',
  },
  {
    id: '3',
    type: 'credit',
    description: 'Refund - Yoga Class',
    amount: 15.00,
    date: '2024-02-01',
    status: 'completed',
  },
  {
    id: '4',
    type: 'debit',
    description: 'Swimming Pool Pass',
    amount: -30.00,
    date: '2024-01-30',
    status: 'completed',
  },
  {
    id: '5',
    type: 'credit',
    description: 'Sponsorship Reward',
    amount: 50.00,
    date: '2024-01-28',
    status: 'completed',
  },
];

const QUICK_ADD_AMOUNTS = [10, 25, 50, 100, 200];

export function WalletBalance({ onBack }: WalletBalanceProps) {
  const [currentBalance] = useState(285.50);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showTopUp, setShowTopUp] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    toast.success(`Added $${amount.toFixed(2)} to your wallet!`);
    setTopUpAmount('');
    setShowTopUp(false);
  };

  const handleQuickAdd = (amount: number) => {
    toast.success(`Added $${amount.toFixed(2)} to your wallet!`);
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (amount > currentBalance) {
      toast.error('Insufficient balance');
      return;
    }
    toast.success(`Withdrew $${amount.toFixed(2)} from your wallet!`);
    setWithdrawAmount('');
    setShowWithdraw(false);
  };

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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Wallet Balance</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your Sporgates wallet
            </p>
          </div>
        </div>

        {/* Current Balance Card */}
        <Card className="bg-gradient-to-br from-[#003C66] to-[#005A99] text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-blue-100 text-sm mb-1">Available Balance</p>
                <h2 className="text-4xl font-bold">${currentBalance.toFixed(2)}</h2>
              </div>
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                <Wallet className="w-8 h-8" />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowTopUp(true);
                  setShowWithdraw(false);
                }}
                className="flex-1 bg-white text-primary hover:bg-blue-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Funds
              </Button>
              <Button
                onClick={() => {
                  setShowWithdraw(true);
                  setShowTopUp(false);
                }}
                variant="outline"
                className="flex-1 border-white/30 text-white hover:bg-white/10"
              >
                <Minus className="w-4 h-4 mr-2" />
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Add Amounts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="w-5 h-5 text-primary" />
              Quick Top-Up
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-3">
              {QUICK_ADD_AMOUNTS.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => handleQuickAdd(amount)}
                  className="hover:bg-primary hover:text-white hover:border-[#003C66]"
                >
                  ${amount}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Up Form */}
        {showTopUp && (
          <Card className="border-[#003C66]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Add Funds to Wallet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topup-amount">Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="topup-amount"
                    type="number"
                    placeholder="0.00"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    className="pl-9"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Visa •••• 4242</p>
                    <p className="text-xs text-muted-foreground">Expires 12/2025</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">Default</Badge>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowTopUp(false);
                    setTopUpAmount('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleTopUp}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Add Funds
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Withdraw Form */}
        {showWithdraw && (
          <Card className="border-[#FC8936]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Minus className="w-5 h-5 text-secondary" />
                Withdraw Funds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="withdraw-amount">Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="withdraw-amount"
                    type="number"
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="pl-9"
                    min="0"
                    step="0.01"
                    max={currentBalance}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Available: ${currentBalance.toFixed(2)}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Withdraw To</Label>
                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Bank Account •••• 7890</p>
                    <p className="text-xs text-muted-foreground">Processing takes 3-5 business days</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowWithdraw(false);
                    setWithdrawAmount('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleWithdraw}
                  className="flex-1 bg-secondary hover:bg-[#E07830]"
                >
                  Withdraw
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-primary" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {RECENT_TRANSACTIONS.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'credit'
                          ? 'bg-green-100'
                          : 'bg-red-100'
                      }`}
                    >
                      {transaction.type === 'credit' ? (
                        <ArrowDownLeft className="w-5 h-5 text-green-600" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        transaction.type === 'credit'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'credit' ? '+' : ''}$
                      {Math.abs(transaction.amount).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => {
                // Navigate to full transaction history
              }}
            >
              View All Transactions
            </Button>
          </CardContent>
        </Card>

        {/* Wallet Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">About Your Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Use your wallet balance for faster checkouts on activities, facilities, and products</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Earn wallet credits through sponsorships, referrals, and achievements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Withdraw funds to your bank account at any time (processing takes 3-5 business days)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Your wallet balance never expires</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
