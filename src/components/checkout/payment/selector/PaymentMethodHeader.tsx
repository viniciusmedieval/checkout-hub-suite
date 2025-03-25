
import React from 'react';
import { CreditCard } from 'lucide-react';
import { ConfigCheckout } from '@/lib/supabase';

interface PaymentMethodHeaderProps {
  configCheckout?: ConfigCheckout | null;
}

export function PaymentMethodHeader({ configCheckout }: PaymentMethodHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <CreditCard size={18} className="text-gray-700" />
      <h2 className="text-base font-semibold text-black">
        {configCheckout?.titulo_pagamento || "Forma de Pagamento"}
      </h2>
    </div>
  );
}
