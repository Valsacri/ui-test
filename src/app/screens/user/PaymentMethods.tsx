import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { ChevronLeft, CreditCard, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentMethodsProps {
  onBack?: () => void;
}

const MOCK_PAYMENT_METHODS = [
  {
    id: '1',
    type: 'visa',
    last4: '4242',
    expiryMonth: '12',
    expiryYear: '2025',
    isDefault: true,
  },
  {
    id: '2',
    type: 'mastercard',
    last4: '8888',
    expiryMonth: '06',
    expiryYear: '2026',
    isDefault: false,
  },
];

export function PaymentMethods({ onBack }: PaymentMethodsProps) {
  const [paymentMethods, setPaymentMethods] = useState(MOCK_PAYMENT_METHODS);

  const handleSetDefault = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
    toast.success('Default payment method updated');
  };

  const handleRemove = (id: string) => {
    setPaymentMethods(methods => methods.filter(method => method.id !== id));
    toast.success('Payment method removed');
  };

  const getCardIcon = (type: string) => {
    const icons: Record<string, string> = {
      visa: '💳',
      mastercard: '💳',
      amex: '💳',
    };
    return icons[type] || '💳';
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
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your saved payment methods
            </p>
          </div>
          <Button className="bg-primary hover:bg-[#002A4A]">
            <Plus className="w-4 h-4 mr-2" />
            Add Card
          </Button>
        </div>

        {/* Payment Methods List */}
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <Card key={method.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#003C66] to-[#005A99] rounded-lg flex items-center justify-center text-2xl">
                      {getCardIcon(method.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 capitalize">
                          {method.type} •••• {method.last4}
                        </p>
                        {method.isDefault && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(method.id)}
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(method.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#003C66]" />
              Payment Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-3">
                <strong>Your payments are secure</strong>
              </p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#003C66] mt-0.5">•</span>
                  <span>All transactions are encrypted using industry-standard SSL</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#003C66] mt-0.5">•</span>
                  <span>We never store your full card details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#003C66] mt-0.5">•</span>
                  <span>Payment processing is handled by trusted partners</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
