import { Check } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

interface Sport {
  id: string;
  name: string;
  icon: string;
}

interface SportSelectorProps {
  sports: Sport[];
  selectedSports: string[];
  onToggle: (sportId: string) => void;
  multiSelect?: boolean;
}

export function SportSelector({
  sports,
  selectedSports,
  onToggle,
  multiSelect = true
}: SportSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {sports.map((sport) => {
        const isSelected = selectedSports.includes(sport.id);
        
        return (
          <button
            key={sport.id}
            onClick={() => onToggle(sport.id)}
            className={cn(
              "relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
              "hover:shadow-md active:scale-95",
              isSelected
                ? "border-blue-500 bg-blue-50 shadow-sm"
                : "border-gray-200 bg-white hover:border-gray-300"
            )}
          >
            {isSelected && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
            <div className="text-3xl mb-2">{sport.icon}</div>
            <span className={cn(
              "text-sm font-medium text-center",
              isSelected ? "text-blue-700" : "text-gray-700"
            )}>
              {sport.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
