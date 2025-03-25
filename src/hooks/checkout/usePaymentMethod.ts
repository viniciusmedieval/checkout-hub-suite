
import { useState, useEffect } from 'react';
import { Produto } from '@/lib/supabase';

export type PaymentMethod = 'card' | 'pix';

type PixProps = {
  tipo_chave_pix: string;
  chave_pix: string;
  nome_beneficiario: string;
};

interface UsePaymentMethodProps {
  initialMethod: PaymentMethod;
  produto?: Produto | null;
  onMethodChange?: (method: PaymentMethod) => void;
  onPaymentMethodChange?: (method: PaymentMethod) => void;
}

export const usePaymentMethod = ({
  initialMethod,
  produto,
  onMethodChange,
  onPaymentMethodChange
}: UsePaymentMethodProps) => {
  const [pixData, setPixData] = useState<PixProps | null>(null);
  const [currentMethod, setCurrentMethod] = useState<PaymentMethod>(initialMethod);
  
  useEffect(() => {
    if (produto) {
      // Default PIX values, ensuring they are strings
      const defaultPixData: PixProps = {
        tipo_chave_pix: produto.tipo_chave_pix || '',
        chave_pix: produto.chave_pix || '',
        nome_beneficiario: produto.nome_beneficiario || ''
      };
      
      setPixData(defaultPixData);
    }
  }, [produto]);

  // Use the provided method change handler or fallback to internal state
  const handleMethodClick = (method: PaymentMethod) => {
    setCurrentMethod(method);
    
    // Call the appropriate prop method based on what's provided
    if (onMethodChange) {
      onMethodChange(method);
    }
    
    if (onPaymentMethodChange) {
      onPaymentMethodChange(method);
    }
  };

  return {
    currentMethod,
    pixData,
    handleMethodClick
  };
};
