
import { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { 
  formatCardNumber, 
  formatCardExpiry, 
  getInstallmentOptions 
} from "@/utils/formatters";
import { CreditCard, User, Calendar, Lock } from "lucide-react";

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
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <CreditCard size={16} />
        </div>
        <Input 
          id="cardNumber" 
          placeholder="Número do cartão" 
          className="pl-9 h-10 text-sm" 
          value={cardNumber}
          onChange={handleCardNumberChange}
          maxLength={19}
        />
      </div>
      
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <User size={16} />
        </div>
        <Input 
          id="cardName" 
          placeholder="Nome impresso no cartão" 
          className="pl-9 h-10 text-sm" 
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Calendar size={16} />
          </div>
          <Input 
            id="cardExpiry" 
            placeholder="MM/AA" 
            className="pl-9 h-10 text-sm" 
            value={cardExpiry}
            onChange={handleCardExpiryChange}
            maxLength={5}
          />
        </div>
        
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Lock size={16} />
          </div>
          <Input 
            id="cardCVV" 
            placeholder="CVV" 
            className="pl-9 h-10 text-sm" 
            value={cardCVV}
            onChange={handleCardCVVChange}
            maxLength={4}
          />
        </div>
      </div>
      
      <div>
        <select 
          id="installments" 
          className="w-full h-10 bg-white border border-gray-200 rounded px-3 text-sm text-gray-900"
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
