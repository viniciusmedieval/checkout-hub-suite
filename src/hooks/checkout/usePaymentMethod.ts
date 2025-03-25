
import { useState } from "react";
import { PaymentStatus } from "@/components/checkout/payment/types";

export interface PaymentMethodProps {
  onMethodChange?: (method: 'card' | 'pix') => void;
  selectedMethod?: 'card' | 'pix';
  customRedirectStatus?: PaymentStatus;
}

export function usePaymentMethod({
  onMethodChange,
  selectedMethod = 'card',
  customRedirectStatus
}: PaymentMethodProps = {}) {
  const [activeMethod, setActiveMethod] = useState<'card' | 'pix'>(selectedMethod);
  
  const handleMethodChange = (method: 'card' | 'pix') => {
    setActiveMethod(method);
    if (onMethodChange) {
      onMethodChange(method);
    }
  };
  
  return {
    activeMethod,
    handleMethodChange,
    customRedirectStatus
  };
}
