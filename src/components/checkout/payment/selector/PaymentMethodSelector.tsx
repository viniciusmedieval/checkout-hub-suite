
import React, { useState, useEffect } from 'react';
import { CreditCard, QrCode } from 'lucide-react';
import { CardPaymentForm } from '../CardPaymentForm';
import { PixPayment } from '../PixPayment';
import { ConfigCheckout, Produto } from '@/lib/supabase';
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
  customRedirectStatus
}: PaymentMethodSelectorProps) {
  const {
    currentMethod,
    pixData,
    handleMethodClick
  } = usePaymentMethod({
    initialMethod: selectedMethod,
    produto,
    onMethodChange,
    onPaymentMethodChange
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
      <PaymentMethodHeader configCheckout={configCheckout} />

      <div className="flex gap-2">
        <PaymentMethodButton
          method="card"
          icon={CreditCard}
          label="Cartão"
          isSelected={currentMethod === 'card'}
          onClick={() => handleMethodClick('card')}
        />
        
        <PaymentMethodButton
          method="pix"
          icon={QrCode}
          label="PIX"
          isSelected={currentMethod === 'pix'}
          onClick={() => handleMethodClick('pix')}
        />
      </div>

      <div className="py-2">
        {currentMethod === 'card' && (
          <CardPaymentForm 
            productValue={productValue}
            configCheckout={configCheckout}
            customRedirectStatus={customRedirectStatus}
          />
        )}
        
        {currentMethod === 'pix' && pixData && (
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
