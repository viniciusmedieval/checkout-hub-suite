
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { formatCardNumber } from "@/utils/formatters";
import { CardInput } from "./CardInput";
import { CardExpiryInput } from "./CardExpiryInput";
import { CardCVVInput } from "./CardCVVInput";
import { InstallmentSelector } from "./InstallmentSelector";

interface CardPaymentFormProps {
  productValue: number;
}

export function CardPaymentForm({ productValue }: CardPaymentFormProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [installments, setInstallments] = useState("1");
  const [isValid, setIsValid] = useState({
    cardNumber: false,
    cardName: false,
    cardExpiry: false,
    cardCVV: false
  });

  const handleCardNumberChange = (value: string) => {
    const formattedValue = formatCardNumber(value);
    setCardNumber(formattedValue);
    setIsValid(prev => ({
      ...prev,
      cardNumber: value.length >= 13 && value.length <= 19
    }));
  };

  const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCardName(value);
    setIsValid(prev => ({
      ...prev,
      cardName: value.trim().length > 3 && value.includes(' ')
    }));
  };

  const handleCardExpiryChange = (value: string, isValid: boolean) => {
    setCardExpiry(value);
    setIsValid(prev => ({
      ...prev,
      cardExpiry: isValid
    }));
  };

  const handleCardCVVChange = (value: string, isValid: boolean) => {
    setCardCVV(value);
    setIsValid(prev => ({
      ...prev,
      cardCVV: isValid
    }));
  };
  
  return (
    <div className="space-y-3">
      <CardInput 
        value={cardNumber}
        onChange={handleCardNumberChange}
        isValid={isValid.cardNumber}
      />
      
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700">
          👤
        </div>
        <Input 
          id="cardName" 
          placeholder="Nome impresso no cartão" 
          className="pl-9 h-10 text-sm bg-black text-white" 
          value={cardName}
          onChange={handleCardNameChange}
        />
      </div>
      
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
      />
    </div>
  );
}
