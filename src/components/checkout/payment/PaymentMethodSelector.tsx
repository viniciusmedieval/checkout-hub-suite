
import React, { useState, useEffect } from 'react';
import { CreditCard, QrCode } from 'lucide-react';
import { CardPaymentForm } from './CardPaymentForm';
import { PixPayment } from './PixPayment';
import { ConfigCheckout, Produto } from '@/lib/supabase';

type PaymentMethod = 'card' | 'pix';
type PixProps = {
  tipo_chave_pix: string;
  chave_pix: string;
  nome_beneficiario: string;
};

interface PaymentMethodSelectorProps {
  productValue: number;
  productName?: string;
  productImage?: string;
  selectedMethod?: PaymentMethod;
  onMethodChange?: (method: PaymentMethod) => void;
  onPaymentMethodChange?: (method: PaymentMethod) => void; // Added to support both naming conventions
  produto?: Produto | null;
  configCheckout?: ConfigCheckout | null;
}

export function PaymentMethodSelector({
  productValue,
  productName,
  productImage,
  selectedMethod = 'card',
  onMethodChange,
  onPaymentMethodChange,
  produto,
  configCheckout
}: PaymentMethodSelectorProps) {
  const [pixData, setPixData] = useState<PixProps | null>(null);
  const [currentMethod, setCurrentMethod] = useState<PaymentMethod>(selectedMethod);
  
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

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <CreditCard size={18} className="text-gray-700" />
        <h2 className="text-base font-semibold text-black">
          {configCheckout?.titulo_pagamento || "Forma de Pagamento"}
        </h2>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleMethodClick('card')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border transition-colors ${
            currentMethod === 'card' 
              ? 'bg-primary/10 border-primary text-primary'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <CreditCard size={18} />
          <span>Cartão</span>
        </button>
        
        <button
          type="button"
          onClick={() => handleMethodClick('pix')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border transition-colors ${
            currentMethod === 'pix' 
              ? 'bg-primary/10 border-primary text-primary' 
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <QrCode size={18} />
          <span>PIX</span>
        </button>
      </div>

      <div className="py-2">
        {currentMethod === 'card' && (
          <CardPaymentForm 
            productValue={productValue}
            configCheckout={configCheckout}
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
