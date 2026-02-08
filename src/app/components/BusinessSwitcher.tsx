import { useState } from 'react';
import { Building2, ChevronDown, Plus, Check } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';

export interface Business {
  id: string;
  name: string;
  type: string;
  logo?: string;
  role: 'owner' | 'manager' | 'staff';
}

interface BusinessSwitcherProps {
  businesses: Business[];
  currentBusinessId: string;
  onBusinessChange: (businessId: string) => void;
  onCreateBusiness: () => void;
}

export function BusinessSwitcher({
  businesses,
  currentBusinessId,
  onBusinessChange,
  onCreateBusiness,
}: BusinessSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const currentBusiness = businesses.find(b => b.id === currentBusinessId);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          {currentBusiness?.logo ? (
            <img src={currentBusiness.logo} alt="" className="w-full h-full rounded-lg object-cover" />
          ) : (
            <Building2 className="w-4 h-4 text-white" />
          )}
        </div>
        <div className="text-left">
          <p className="font-semibold text-sm">{currentBusiness?.name}</p>
          <p className="text-xs text-muted-foreground capitalize">{currentBusiness?.role}</p>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute top-full left-0 mt-2 w-72 z-50"
            >
              <Card className="p-2 shadow-lg">
                <div className="mb-2 px-2 py-1">
                  <p className="text-xs font-medium text-muted-foreground">Your Businesses</p>
                </div>
                
                <div className="space-y-1">
                  {businesses.map((business) => (
                    <button
                      key={business.id}
                      onClick={() => {
                        onBusinessChange(business.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        business.id === currentBusinessId
                          ? 'bg-blue-50 text-blue-900'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                        {business.logo ? (
                          <img src={business.logo} alt="" className="w-full h-full rounded-lg object-cover" />
                        ) : (
                          <Building2 className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-sm">{business.name}</p>
                        <p className="text-xs text-muted-foreground">{business.type}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground capitalize">{business.role}</span>
                        {business.id === currentBusinessId && (
                          <Check className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t">
                  <Button
                    onClick={() => {
                      onCreateBusiness();
                      setIsOpen(false);
                    }}
                    variant="ghost"
                    className="w-full justify-start gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create New Business
                  </Button>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
