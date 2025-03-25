
import { useState, useEffect } from 'react';
import { PaymentMethod } from '@/components/checkout/payment/selector/PaymentMethodSelector';
import { PaymentStatus } from '@/components/checkout/payment/types';

interface UsePaymentMethodProps {
  selectedMethod?: PaymentMethod;
  onMethodChange?: (method: PaymentMethod) => void;
  customRedirectStatus?: PaymentStatus;
}

export const usePaymentMethod = ({
  selectedMethod = 'card',
  onMethodChange,
  customRedirectStatus,
}: UsePaymentMethodProps) => {
  const [activeMethod, setActiveMethod] = useState<PaymentMethod>(selectedMethod);

  // Update active method if props change
  useEffect(() => {
    if (selectedMethod && selectedMethod !== activeMethod) {
      setActiveMethod(selectedMethod);
    }
  }, [selectedMethod]);

  // Handle payment method change
  const handleMethodChange = (method: PaymentMethod) => {
    setActiveMethod(method);
    
    // Call the onMethodChange callback if provided
    if (onMethodChange) {
      onMethodChange(method);
    }
  };

  return {
    activeMethod,
    handleMethodChange,
    customRedirectStatus
  };
};
