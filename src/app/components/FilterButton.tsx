import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';

interface FilterButtonProps {
  label: string;
  value?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClear?: () => void;
}

export function FilterButton({ label, value, icon, children, onClear }: FilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasValue = value && value !== 'all' && value !== '';

  return (
    <>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition-colors text-sm"
      >
        {icon && <span className="text-gray-600">{icon}</span>}
        <span className="font-medium text-gray-700">{label}</span>
        {hasValue ? (
          <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-[#003C66] text-white">
            {value}
          </Badge>
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
        )}
      </button>

      {/* Filter Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Filter Panel */}
          <div className="fixed inset-x-0 bottom-0 z-50">
            <div 
              className="bg-white rounded-t-3xl shadow-2xl max-h-[70vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
                <div className="flex items-center gap-2">
                  {icon && <span className="text-[#003C66]">{icon}</span>}
                  <h3 className="font-semibold text-lg text-[#003C66]">{label}</h3>
                </div>
                <div className="flex items-center gap-2">
                  {onClear && hasValue && (
                    <button
                      onClick={() => {
                        onClear();
                        setIsOpen(false);
                      }}
                      className="text-sm text-[#FC8936] hover:text-[#003C66] font-medium"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Filter Content - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {children}
              </div>

              {/* Footer with Apply Button */}
              <div className="px-6 py-4 border-t bg-white sticky bottom-0">
                <Button
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-gradient-to-r from-[#003C66] to-[#FC8936] hover:opacity-90"
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
