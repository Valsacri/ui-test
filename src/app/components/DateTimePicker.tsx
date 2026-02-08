import { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Label } from './ui/label';

interface DateTimePickerProps {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  type: 'date' | 'time';
  required?: boolean;
  id?: string;
  placeholder?: string;
  minDate?: string;
}

export function DateTimePicker({
  label,
  value = '',
  onChange,
  type,
  required = false,
  id,
  placeholder,
  minDate,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null);
  const [selectedTime, setSelectedTime] = useState(value || '');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateSelect = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(selected);
    const formattedDate = selected.toISOString().split('T')[0];
    onChange(formattedDate);
    setIsOpen(false);
  };

  const formatDisplayDate = (date: Date | null) => {
    if (!date) return placeholder || 'Select date';
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const hourStr = hour.toString().padStart(2, '0');
        const minuteStr = minute.toString().padStart(2, '0');
        const time24 = `${hourStr}:${minuteStr}`;
        const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const display = `${hour12}:${minuteStr} ${ampm}`;
        slots.push({ value: time24, display });
      }
    }
    return slots;
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    onChange(time);
    setIsOpen(false);
  };

  const formatDisplayTime = (time: string) => {
    if (!time) return placeholder || 'Select time';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  const isDateDisabled = (day: number) => {
    if (!minDate) return false;
    const dateToCheck = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const minDateTime = new Date(minDate);
    return dateToCheck < minDateTime;
  };

  const renderCalendar = () => {
    const days = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);
    const today = new Date();
    const cells = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="p-2" />);
    }

    // Days of the month
    for (let day = 1; day <= days; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isSelected = selectedDate && 
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();
      const isToday = 
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
      const disabled = isDateDisabled(day);

      cells.push(
        <button
          key={day}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && handleDateSelect(day)}
          className={`
            p-2 text-sm rounded-lg transition-all
            ${disabled 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'hover:bg-gray-100 cursor-pointer'
            }
            ${isSelected 
              ? 'bg-primary text-white hover:bg-[#002A4A]' 
              : ''
            }
            ${isToday && !isSelected 
              ? 'border-2 border-[#003C66] font-semibold' 
              : ''
            }
          `}
        >
          {day}
        </button>
      );
    }

    return cells;
  };

  if (type === 'date') {
    return (
      <div className="relative" ref={dropdownRef}>
        {label && (
          <Label htmlFor={id} className="mb-2 block">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}
        
        <button
          id={id}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-gray-400 transition-colors bg-white"
        >
          <span className={selectedDate ? 'text-gray-900' : 'text-gray-500'}>
            {formatDisplayDate(selectedDate)}
          </span>
          <Calendar className="w-5 h-5 text-gray-400" />
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-4 w-80">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="font-semibold text-gray-900">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-gray-500 p-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Time picker
  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <Label htmlFor={id} className="mb-2 block">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-gray-400 transition-colors bg-white"
      >
        <span className={selectedTime ? 'text-gray-900' : 'text-gray-500'}>
          {formatDisplayTime(selectedTime)}
        </span>
        <Clock className="w-5 h-5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl w-full max-h-64 overflow-y-auto">
          {generateTimeSlots().map((slot) => (
            <button
              key={slot.value}
              type="button"
              onClick={() => handleTimeSelect(slot.value)}
              className={`
                w-full px-4 py-2.5 text-left text-sm transition-colors
                ${selectedTime === slot.value 
                  ? 'bg-primary text-white' 
                  : 'hover:bg-gray-100'
                }
              `}
            >
              {slot.display}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
