
import { Input } from "@/components/ui/input";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

interface CardExpiryInputProps {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
}

export function CardExpiryInput({ value, onChange }: CardExpiryInputProps) {
  const [isValid, setIsValid] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, '');
    
    if (newValue.length <= 4) {
      let formatted = newValue;
      if (newValue.length > 2) {
        formatted = `${newValue.slice(0, 2)}/${newValue.slice(2)}`;
      }
      
      validateExpiry(newValue, formatted);
    }
  };
  
  const validateExpiry = (raw: string, formatted: string) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed
    const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
    
    let isExpiryValid = false;
    
    if (raw.length === 4) {
      const month = parseInt(raw.slice(0, 2));
      const year = parseInt(raw.slice(2, 4));
      
      if (
        month >= 1 && 
        month <= 12 && 
        (year > currentYear || (year === currentYear && month >= currentMonth))
      ) {
        isExpiryValid = true;
      }
    }
    
    setIsValid(isExpiryValid);
    onChange(formatted, isExpiryValid);
  };
  
  useEffect(() => {
    if (value && value.includes('/')) {
      const parts = value.split('/');
      if (parts.length === 2) {
        const raw = parts[0] + parts[1];
        validateExpiry(raw, value);
      }
    }
  }, []);
  
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700">
        <CalendarDays size={16} />
      </div>
      {isValid && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
          <CheckCircle2 size={16} />
        </div>
      )}
      <Input 
        id="cardExpiry" 
        placeholder="MM/AA" 
        className="pl-9 h-10 text-sm bg-white text-black" 
        value={value}
        onChange={handleChange}
        type="tel"
        inputMode="numeric"
      />
    </div>
  );
}
