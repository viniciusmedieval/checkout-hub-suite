
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardInput } from "./CardInput";
import { CardExpiryInput } from "./CardExpiryInput";
import { CardCVVInput } from "./CardCVVInput";
import { InstallmentSelector } from "./InstallmentSelector";
import { User, CheckCircle2, CreditCard } from "lucide-react";
import { ConfigCheckout } from "@/lib/supabase";
import { toast } from "sonner";

interface CardPaymentFormProps {
  productValue: number;
  configCheckout?: ConfigCheckout | null;
  onPaymentSubmit?: (data: CardFormData) => void;
  customRedirectStatus?: PaymentStatus;
}

export type CardFormData = {
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCVV: string;
  installments: string;
};

export type PaymentStatus = 'analyzing' | 'approved' | 'rejected';

export function CardPaymentForm({ 
  productValue, 
  configCheckout, 
  onPaymentSubmit,
  customRedirectStatus 
}: CardPaymentFormProps) {
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
  const [formIsComplete, setFormIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const validateCard = configCheckout?.validar_cartao === true;
  const buttonColor = configCheckout?.cor_botao || "#8B5CF6";
  const buttonTextColor = configCheckout?.cor_texto_botao || "#FFFFFF";

  const handleCardNumberChange = (value: string, isValid: boolean) => {
    setCardNumber(value);
    setIsValid(prev => ({
      ...prev,
      cardNumber: isValid
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
  
  const handleSubmitPayment = () => {
    if (!formIsComplete) return;
    
    setIsSubmitting(true);
    
    const cardData: CardFormData = {
      cardNumber,
      cardName,
      cardExpiry,
      cardCVV,
      installments
    };
    
    // Log de debugging
    console.log("Processando pagamento com cartão:", { 
      slug, 
      customRedirectStatus,
      cardData: { ...cardData, cardNumber: "****" } // Mascara o número do cartão no log
    });
    
    if (onPaymentSubmit) {
      onPaymentSubmit(cardData);
    } else {
      setTimeout(() => {
        try {
          if (slug) {
            // Determinar o status de redirecionamento
            let redirectStatus: PaymentStatus;
            
            if (customRedirectStatus) {
              redirectStatus = customRedirectStatus;
              console.log("Usando status personalizado:", redirectStatus);
            } else if (configCheckout?.redirect_card_status) {
              redirectStatus = configCheckout.redirect_card_status as PaymentStatus;
              console.log("Usando status da configuração global:", redirectStatus);
            } else {
              // Fallback para um status aleatório ou padrão
              redirectStatus = 'analyzing';
              console.log("Usando status padrão:", redirectStatus);
            }
            
            // Redirecionamento para a página adequada
            navigate(`/payment-status/${slug}/${redirectStatus}`);
          } else {
            console.error("Slug não encontrado para redirecionamento");
            toast.error("Erro ao processar pagamento: referência do produto não encontrada");
          }
        } catch (error) {
          console.error("Erro no redirecionamento:", error);
          toast.error("Erro ao processar pagamento");
        } finally {
          setIsSubmitting(false);
        }
      }, 1500);
    }
  };
  
  useEffect(() => {
    setFormIsComplete(
      isValid.cardNumber && 
      isValid.cardName && 
      isValid.cardExpiry && 
      isValid.cardCVV
    );
  }, [isValid]);
  
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
      />
      
      {formIsComplete && (
        <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
          <CheckCircle2 size={16} />
          <span>Informações do cartão validadas</span>
        </div>
      )}
      
      <Button
        onClick={handleSubmitPayment}
        disabled={!formIsComplete || isSubmitting}
        className="w-full mt-4 gap-2 h-11"
        style={{
          backgroundColor: buttonColor,
          color: buttonTextColor
        }}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processando...
          </>
        ) : (
          <>
            <CreditCard size={18} />
            Pagar com Cartão
          </>
        )}
      </Button>
    </div>
  );
}
