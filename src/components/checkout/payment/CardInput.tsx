
import { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";

interface CardInputProps {
  value: string;
  onChange: (value: string) => void;
  isValid: boolean;
}

export function CardInput({ value, onChange, isValid }: CardInputProps) {
  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    onChange(value);
  };

  // Detect card brand based on first digits
  const getCardBrand = (cardNumber: string) => {
    const number = cardNumber.replace(/\D/g, "");
    if (!number) return null;
    
    // Simplified detection
    if (number.startsWith("4")) return "visa";
    if (/^5[1-5]/.test(number)) return "mastercard";
    if (/^3[47]/.test(number)) return "amex";
    if (/^6(?:011|5)/.test(number)) return "discover";
    if (/^(?:2131|1800|35)/.test(number)) return "jcb";
    
    return null;
  };

  const cardBrand = getCardBrand(value);

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700">
        💳
      </div>
      <Input 
        id="cardNumber" 
        placeholder="Número do cartão" 
        className="pl-9 h-10 text-sm pr-12 bg-black text-white" 
        value={value}
        onChange={handleCardNumberChange}
        maxLength={19}
      />
      {cardBrand && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <img 
            src={`/assets/card-brands/${cardBrand}.svg`} 
            alt={cardBrand}
            className="h-5 w-auto"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        </div>
      )}
    </div>
  );
}
