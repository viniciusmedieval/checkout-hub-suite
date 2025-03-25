
import React, { useState, useEffect } from 'react';
import { CreditCard, QrCode } from 'lucide-react';
import { CardPaymentForm } from '../CardPaymentForm';
import { PixPayment } from '../PixPayment';
import { ConfigCheckout, Produto } from '@/lib/types/database-types';
import { PaymentStatus } from '../types';
import { PaymentMethodButton } from './PaymentMethodButton';
import { PaymentMethodHeader } from './PaymentMethodHeader';
import { usePaymentMethod } from '@/hooks/checkout/usePaymentMethod';

export type PaymentMethod = 'card' | 'pix';
type PixProps = {
  tipo_chave_pix: string;
  chave_pix: string;
  nome_beneficiario: string;
};

export interface PaymentMethodSelectorProps {
  productValue: number;
  productName?: string;
  productImage?: string;
  selectedMethod?: PaymentMethod;
  onMethodChange?: (method: PaymentMethod) => void;
  onPaymentMethodChange?: (method: PaymentMethod) => void; // Added to support both naming conventions
  produto?: Produto | null;
  configCheckout?: ConfigCheckout | null;
  customRedirectStatus?: PaymentStatus;
  randomMode?: boolean;
}

export function PaymentMethodSelector({
  productValue,
  productName,
  productImage,
  selectedMethod = 'card',
  onMethodChange,
  onPaymentMethodChange,
  produto,
  configCheckout,
  customRedirectStatus,
  randomMode = false
}: PaymentMethodSelectorProps) {
  const {
    activeMethod,
    handleMethodChange,
    paymentStatus
  } = usePaymentMethod({
    selectedMethod,
    onMethodChange: (method) => {
      // Call both method change handlers if provided
      if (onMethodChange) onMethodChange(method);
      if (onPaymentMethodChange) onPaymentMethodChange(method);
    },
    customRedirectStatus,
    randomMode
  });

  // Extract PIX data from product
  const [pixData, setPixData] = useState<PixProps | null>(null);
  
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

  // Create a typed version of configCheckout with correct redirect_card_status type
  const typedConfigCheckout = configCheckout ? {
    ...configCheckout,
    redirect_card_status: configCheckout.redirect_card_status as PaymentStatus
  } : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
      <PaymentMethodHeader configCheckout={typedConfigCheckout} />

      <div className="flex gap-2">
        <PaymentMethodButton
          method="card"
          icon={CreditCard}
          label="Cartão"
          isSelected={activeMethod === 'card'}
          onClick={() => handleMethodChange('card')}
        />
        
        <PaymentMethodButton
          method="pix"
          icon={QrCode}
          label="PIX"
          isSelected={activeMethod === 'pix'}
          onClick={() => handleMethodChange('pix')}
        />
      </div>

      <div className="py-2">
        {activeMethod === 'card' && (
          <CardPaymentForm 
            productValue={productValue}
            configCheckout={typedConfigCheckout}
            customRedirectStatus={paymentStatus}
          />
        )}
        
        {activeMethod === 'pix' && pixData && (
          <PixPayment 
            productValue={productValue}
            countdown={15 * 60} // Default 15 minutes countdown in seconds
            pixConfig={pixData}
          />
        )}
      </div>
    </div>
  );
}
