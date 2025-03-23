
import { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { 
  formatCardNumber, 
  formatCardExpiry, 
  getInstallmentOptions 
} from "@/utils/formatters";
import { CreditCard, User, Calendar, Lock, CheckCircle } from "lucide-react";

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
  
  const installmentOptions = getInstallmentOptions(productValue);

  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = formatCardNumber(value);
    setCardNumber(formattedValue);
    setIsValid(prev => ({
      ...prev,
      cardNumber: value.length >= 13 && value.length <= 19
    }));
  };

  const handleCardNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCardName(value);
    setIsValid(prev => ({
      ...prev,
      cardName: value.trim().length > 3 && value.includes(' ')
    }));
  };

  const handleCardExpiryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = formatCardExpiry(value);
    setCardExpiry(formattedValue);
    
    // Validate expiry date (simple validation for demo)
    if (formattedValue.length === 5) {
      const [month, year] = formattedValue.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      const isValidMonth = parseInt(month) >= 1 && parseInt(month) <= 12;
      const isValidYear = parseInt(year) >= currentYear;
      const isValidDate = isValidYear && (parseInt(year) > currentYear || parseInt(month) >= currentMonth);
      
      setIsValid(prev => ({
        ...prev,
        cardExpiry: isValidMonth && isValidDate
      }));
    } else {
      setIsValid(prev => ({
        ...prev,
        cardExpiry: false
      }));
    }
  };

  const handleCardCVVChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCardCVV(value);
      setIsValid(prev => ({
        ...prev,
        cardCVV: value.length >= 3
      }));
    }
  };

  // Detect card brand based on first digits
  const getCardBrand = (cardNumber: string) => {
    const number = cardNumber.replace(/\D/g, '');
    if (!number) return null;
    
    // Simplified detection
    if (number.startsWith('4')) return 'visa';
    if (/^5[1-5]/.test(number)) return 'mastercard';
    if (/^3[47]/.test(number)) return 'amex';
    if (/^6(?:011|5)/.test(number)) return 'discover';
    if (/^(?:2131|1800|35)/.test(number)) return 'jcb';
    
    return null;
  };

  const cardBrand = getCardBrand(cardNumber);
  
  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <CreditCard size={16} />
        </div>
        <Input 
          id="cardNumber" 
          placeholder="Número do cartão" 
          className="pl-9 h-10 text-sm pr-12" 
          value={cardNumber}
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
                target.style.display = 'none';
              }}
            />
          </div>
        )}
        {isValid.cardNumber && !cardBrand && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
            <CheckCircle size={16} />
          </div>
        )}
      </div>
      
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <User size={16} />
        </div>
        {isValid.cardName && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
            <CheckCircle size={16} />
          </div>
        )}
        <Input 
          id="cardName" 
          placeholder="Nome impresso no cartão" 
          className="pl-9 h-10 text-sm" 
          value={cardName}
          onChange={handleCardNameChange}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Calendar size={16} />
          </div>
          {isValid.cardExpiry && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
              <CheckCircle size={16} />
            </div>
          )}
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
          {isValid.cardCVV && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
              <CheckCircle size={16} />
            </div>
          )}
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
