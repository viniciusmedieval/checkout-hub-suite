
import { useState } from "react";
import { CreditCard, QrCode } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardPaymentForm } from "./CardPaymentForm";
import { PixPayment } from "./PixPayment";
import { PaymentMethod } from "@/hooks/useCheckout";

interface PaymentMethodSelectorProps {
  productValue: number;
  pixConfig: {
    tipo_chave_pix: string;
    chave_pix: string;
    nome_beneficiario: string;
  } | null;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  produto?: {
    banner_url?: string;
    nome?: string;
  };
}

export function PaymentMethodSelector({ 
  productValue, 
  pixConfig, 
  onPaymentMethodChange,
  produto
}: PaymentMethodSelectorProps) {
  const [countdown] = useState(15 * 60); // 15 minutes in seconds
  
  return (
    <div className="p-4">
      <h2 className="text-base font-semibold mb-3">Pagamento</h2>
      
      <Tabs 
        defaultValue="card" 
        className="w-full" 
        onValueChange={(value) => onPaymentMethodChange(value as PaymentMethod)}
      >
        <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100 rounded-md border border-gray-200">
          <TabsTrigger 
            value="card" 
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-sm py-2.5 rounded-md"
          >
            <CreditCard size={16} className="mr-2" />
            Cartão de Crédito
          </TabsTrigger>
          <TabsTrigger 
            value="pix" 
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-sm py-2.5 rounded-md"
          >
            <QrCode size={16} className="mr-2" />
            Pix
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="card" className="mt-0">
          <CardPaymentForm productValue={productValue} />
        </TabsContent>
        
        <TabsContent value="pix" className="mt-0">
          <PixPayment pixConfig={pixConfig} countdown={countdown} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
