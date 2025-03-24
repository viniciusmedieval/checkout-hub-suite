
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardPaymentForm } from "./CardPaymentForm";
import { PixPayment } from "./PixPayment";
import { CreditCard, QrCode } from "lucide-react";
import { Produto, ConfigCheckout } from "@/lib/supabase";
import { useState } from "react";

interface PaymentMethodSelectorProps {
  productValue: number;
  pixConfig: {
    tipo_chave_pix?: string;
    chave_pix?: string;
    nome_beneficiario?: string;
  } | null;
  onPaymentMethodChange?: (method: 'card' | 'pix') => void;
  produto: Produto;
  configCheckout?: ConfigCheckout | null;
}

export function PaymentMethodSelector({ 
  productValue, 
  pixConfig, 
  onPaymentMethodChange,
  produto,
  configCheckout
}: PaymentMethodSelectorProps) {
  const [activeTab, setActiveTab] = useState<'card' | 'pix'>('card');
  
  // Use custom title from config or default
  const titlePagamento = configCheckout?.titulo_pagamento || "Pagamento";
  
  const handleTabChange = (value: string) => {
    if (value === 'card' || value === 'pix') {
      setActiveTab(value);
      if (onPaymentMethodChange) {
        onPaymentMethodChange(value);
      }
    }
  };

  return (
    <div className="p-4">
      <h3 className="font-medium text-gray-800 mb-4">{titlePagamento}</h3>
      
      <Tabs 
        defaultValue="card" 
        className="w-full"
        onValueChange={handleTabChange}
      >
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger 
            value="card" 
            className="flex items-center gap-2 py-2.5 data-[state=active]:bg-violet-50 data-[state=active]:text-violet-800"
          >
            <CreditCard size={16} />
            <span>Cartão</span>
          </TabsTrigger>
          <TabsTrigger 
            value="pix" 
            className="flex items-center gap-2 py-2.5 data-[state=active]:bg-violet-50 data-[state=active]:text-violet-800"
          >
            <QrCode size={16} />
            <span>Pix</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="card" className="mt-0">
          <CardPaymentForm 
            productValue={productValue} 
            configCheckout={configCheckout}
          />
        </TabsContent>
        
        <TabsContent value="pix" className="mt-0">
          <PixPayment 
            productValue={productValue}
            pixConfig={pixConfig || {}}
            produto={produto} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
