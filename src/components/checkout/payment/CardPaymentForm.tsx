
import { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { 
  formatCardNumber, 
  formatCardExpiry, 
  getInstallmentOptions 
} from "@/utils/formatters";

interface CardPaymentFormProps {
  productValue: number;
}

export function CardPaymentForm({ productValue }: CardPaymentFormProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [installments, setInstallments] = useState("1");
  
  const installmentOptions = getInstallmentOptions(productValue);

  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCardNumber(formatCardNumber(value));
  };

  const handleCardExpiryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCardExpiry(formatCardExpiry(value));
  };

  const handleCardCVVChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCardCVV(value);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="cardNumber" className="checkout-label">Número do cartão</label>
        <Input 
          id="cardNumber" 
          placeholder="0000 0000 0000 0000" 
          className="checkout-input" 
          value={cardNumber}
          onChange={handleCardNumberChange}
          maxLength={19}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="cardName" className="checkout-label">Nome no cartão</label>
        <Input 
          id="cardName" 
          placeholder="Nome como está impresso no cartão" 
          className="checkout-input" 
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="cardExpiry" className="checkout-label">Vencimento</label>
          <Input 
            id="cardExpiry" 
            placeholder="MM/AA" 
            className="checkout-input" 
            value={cardExpiry}
            onChange={handleCardExpiryChange}
            maxLength={5}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="cardCVV" className="checkout-label">CVV</label>
          <Input 
            id="cardCVV" 
            placeholder="123" 
            className="checkout-input" 
            value={cardCVV}
            onChange={handleCardCVVChange}
            maxLength={4}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="installments" className="checkout-label">Parcelas</label>
        <select 
          id="installments" 
          className="w-full h-10 bg-[hsl(var(--checkout-input-bg))] border border-[hsl(var(--checkout-border))] rounded-md px-3 text-[hsl(var(--checkout-text))]"
          value={installments}
          onChange={(e) => setInstallments(e.target.value)}
        >
          {installmentOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
