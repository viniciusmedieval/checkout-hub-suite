
import { Input } from "@/components/ui/input";
import { User, CheckCircle2 } from "lucide-react";
import { CardInput } from "../CardInput";
import { CardExpiryInput } from "../CardExpiryInput";
import { CardCVVInput } from "../CardCVVInput";
import { InstallmentSelector } from "../InstallmentSelector";

interface CardFormSectionProps {
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCVV: string;
  installments: string;
  isValid: {
    cardNumber: boolean;
    cardName: boolean;
    cardExpiry: boolean;
    cardCVV: boolean;
  };
  productValue: number;
  maxInstallments: number;
  validateCard: boolean;
  handleCardNumberChange: (value: string, isValid: boolean) => void;
  handleCardNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCardExpiryChange: (value: string, isValid: boolean) => void;
  handleCardCVVChange: (value: string, isValid: boolean) => void;
  setInstallments: (value: string) => void;
}

export function CardFormSection({
  cardNumber,
  cardName,
  cardExpiry,
  cardCVV,
  installments,
  isValid,
  productValue,
  maxInstallments,
  validateCard,
  handleCardNumberChange,
  handleCardNameChange,
  handleCardExpiryChange,
  handleCardCVVChange,
  setInstallments
}: CardFormSectionProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          <User size={18} />
        </div>
        {isValid.cardName && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
            <CheckCircle2 size={16} />
          </div>
        )}
        <Input 
          id="cardName" 
          placeholder="Nome impresso no cartão" 
          className="pl-9 h-11 text-sm bg-white text-black rounded-lg" 
          value={cardName}
          onChange={handleCardNameChange}
        />
      </div>
      
      <CardInput 
        value={cardNumber}
        onChange={handleCardNumberChange}
        validateCard={validateCard}
      />
      
      <div className="grid grid-cols-2 gap-3">
        <CardExpiryInput
          value={cardExpiry}
          onChange={handleCardExpiryChange}
        />
        
        <CardCVVInput
          value={cardCVV}
          onChange={handleCardCVVChange}
        />
      </div>
      
      <InstallmentSelector
        productValue={productValue}
        value={installments}
        onChange={setInstallments}
        maxInstallments={maxInstallments}
      />
    </div>
  );
}
