
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ConfigCheckout } from "@/lib/supabase";
import { toast } from "sonner";
import { CardFormData, PaymentStatus } from "@/components/checkout/payment/types";

export const useCardPaymentForm = (
  customRedirectStatus?: PaymentStatus,
  configCheckout?: ConfigCheckout | null,
  onPaymentSubmit?: (data: CardFormData) => void
) => {
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
      configCardStatus: configCheckout?.redirect_card_status,
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
              // Fallback para um status padrão
              redirectStatus = 'analyzing';
              console.log("Usando status padrão:", redirectStatus);
            }
            
            // Redirecionamento para a página adequada
            console.log(`Redirecionando para: /payment-status/${slug}/${redirectStatus}`);
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

  return {
    cardNumber,
    cardName,
    cardExpiry,
    cardCVV,
    installments,
    isValid,
    formIsComplete,
    isSubmitting,
    setInstallments,
    handleCardNumberChange,
    handleCardNameChange,
    handleCardExpiryChange,
    handleCardCVVChange,
    handleSubmitPayment
  };
};
