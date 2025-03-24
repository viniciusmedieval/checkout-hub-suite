
import { Input } from "@/components/ui/input";
import { CreditCard, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

interface CardInputProps {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
}

export function CardInput({ value, onChange }: CardInputProps) {
  const [isValid, setIsValid] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, '');
    if (newValue.length <= 16) {
      validateCard(newValue);
    }
  };
  
  const validateCard = (cardNumber: string) => {
    // Basic validation - check length and apply Luhn algorithm
    let isCardValid = false;
    
    if (cardNumber.length >= 13 && cardNumber.length <= 19) {
      // Apply Luhn algorithm (mod 10)
      let sum = 0;
      let shouldDouble = false;
      
      // Loop from right to left
      for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i));
        
        if (shouldDouble) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        
        sum += digit;
        shouldDouble = !shouldDouble;
      }
      
      isCardValid = (sum % 10) === 0 && sum > 0;
    }
    
    // Format the card number for display (groups of 4 digits)
    const formatted = cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    setIsValid(isCardValid);
    onChange(formatted, isCardValid);
  };
  
  useEffect(() => {
    // Initial validation if there's already a value
    if (value) {
      const cleanValue = value.replace(/\D/g, '');
      validateCard(cleanValue);
    }
  }, []);
  
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10">
        <CreditCard size={18} />
      </div>
      {isValid && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 z-10">
          <CheckCircle2 size={16} />
        </div>
      )}
      <Input 
        id="cardNumber" 
        placeholder="Número do cartão" 
        className="pl-10 h-11 text-sm bg-white text-black rounded-lg border-gray-200 focus-visible:ring-gray-300" 
        value={value}
        onChange={handleChange}
        type="tel" 
        inputMode="numeric"
      />
    </div>
  );
}
