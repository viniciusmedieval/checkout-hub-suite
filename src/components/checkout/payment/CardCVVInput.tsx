
import { Input } from "@/components/ui/input";
import { LockKeyhole, CheckCircle2 } from "lucide-react";

interface CardCVVInputProps {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
}

export function CardCVVInput({ value, onChange }: CardCVVInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, '');
    
    if (newValue.length <= 4) {
      const isValid = newValue.length >= 3;
      onChange(newValue, isValid);
    }
  };
  
  const isValidCVV = value.length >= 3;
  
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700">
        <LockKeyhole size={16} />
      </div>
      {isValidCVV && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
          <CheckCircle2 size={16} />
        </div>
      )}
      <Input 
        id="cardCVV" 
        placeholder="CVV" 
        className="pl-9 h-10 text-sm bg-white text-black" 
        value={value}
        onChange={handleChange}
        type="tel"
        inputMode="numeric"
        maxLength={4}
      />
    </div>
  );
}
