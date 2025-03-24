
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCheckoutData } from "../useCheckoutData";
import { useCheckoutForm, FormData } from "./useCheckoutForm";
import { useVisitorCounter } from "./useVisitorCounter";
import { validateCPF, validateMobilePhone } from "./useValidation";

export type { FormData };
export type PaymentMethod = 'card' | 'pix';

export const useCheckout = () => {
  const { slug } = useParams<{ slug: string }>();
  const { produto, configCheckout, loading, error } = useCheckoutData(slug);
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [countdown, setCountdown] = useState(15 * 60); // 15 minutes in seconds
  
  // Import form handling from the separate hook
  const {
    formData,
    formErrors,
    isSubmitting,
    handleInputChange,
    submitOrder,
    validateForm
  } = useCheckoutForm(produto);
  
  // Import visitor counter from the separate hook
  const { visitorCount } = useVisitorCounter(configCheckout);

  return {
    produto,
    configCheckout,
    loading,
    error,
    formData,
    formErrors,
    paymentMethod,
    isSubmitting,
    countdown,
    visitorCount,
    handleInputChange,
    setPaymentMethod,
    submitOrder,
    validateForm,
    validateCPF,
    validateMobilePhone
  };
};
