
import { Input } from "@/components/ui/input";
import { LockKeyhole, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

interface CardCVVInputProps {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
}

export function CardCVVInput({ value, onChange }: CardCVVInputProps) {
  const [isValid, setIsValid] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, '');
    
    if (newValue.length <= 4) {
      validateCVV(newValue);
    }
  };
  
  const validateCVV = (cvv: string) => {
    // CVV validation:
    // 1. Must be 3-4 digits
    // 2. Cannot be all zeros ("000")
    const isValidCVV = 
      (cvv.length >= 3 && cvv.length <= 4) && 
      (cvv !== "000" && cvv !== "0000");
    
    setIsValid(isValidCVV);
    onChange(cvv, isValidCVV);
  };
  
  useEffect(() => {
    // Initial validation if there's already a value
    if (value) {
      validateCVV(value);
    }
  }, []);
  
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
        <LockKeyhole size={18} />
      </div>
      {isValid && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
          <CheckCircle2 size={16} />
        </div>
      )}
      <Input 
        id="cardCVV" 
        placeholder="CVV" 
        className="pl-9 h-11 text-sm bg-white text-black rounded-lg border-gray-200 focus-visible:ring-gray-300" 
        value={value}
        onChange={handleChange}
        type="tel"
        inputMode="numeric"
        maxLength={4}
      />
    </div>
  );
}
