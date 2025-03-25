
import { useState, useEffect } from 'react';
import { PaymentMethod } from '@/components/checkout/payment/selector/PaymentMethodSelector';
import { PaymentStatus } from '@/components/checkout/payment/types';

interface UsePaymentMethodProps {
  selectedMethod?: PaymentMethod;
  onMethodChange?: (method: PaymentMethod) => void;
  customRedirectStatus?: PaymentStatus;
  randomMode?: boolean;
}

export const usePaymentMethod = ({
  selectedMethod = 'card',
  onMethodChange,
  customRedirectStatus,
  randomMode = false,
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
  
  // Function to generate a random status when random mode is enabled
  const getPaymentStatus = (): PaymentStatus => {
    if (!randomMode) {
      return customRedirectStatus || 'analyzing';
    }
    
    // With random mode enabled, randomly choose a status
    const randomStatuses: PaymentStatus[] = ['analyzing', 'approved', 'rejected'];
    const randomIndex = Math.floor(Math.random() * randomStatuses.length);
    console.log(`🎲 Random mode enabled: generating random status - ${randomStatuses[randomIndex]}`);
    return randomStatuses[randomIndex];
  };

  return {
    activeMethod,
    handleMethodChange,
    paymentStatus: getPaymentStatus(),
    randomMode
  };
};
