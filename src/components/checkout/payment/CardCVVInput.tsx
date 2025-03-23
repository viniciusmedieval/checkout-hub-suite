
import { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";

interface CardCVVInputProps {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
}

export function CardCVVInput({ value, onChange }: CardCVVInputProps) {
  const handleCardCVVChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      onChange(value, value.length >= 3);
    }
  };

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700">
        🔒
      </div>
      <Input 
        id="cardCVV" 
        placeholder="CVV" 
        className="pl-9 h-10 text-sm bg-black text-white" 
        value={value}
        onChange={handleCardCVVChange}
        maxLength={4}
      />
    </div>
  );
}
