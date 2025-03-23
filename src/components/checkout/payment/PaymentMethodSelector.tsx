
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardPaymentForm } from "./CardPaymentForm";
import { PixPayment } from "./PixPayment";
import { PaymentMethod } from "@/hooks/useCheckout";
import { CreditCard } from "lucide-react";

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
    valor?: number;
  };
}

export function PaymentMethodSelector({ 
  productValue, 
  pixConfig, 
  onPaymentMethodChange,
  produto
}: PaymentMethodSelectorProps) {
  const [activeTab, setActiveTab] = useState<PaymentMethod>("card");
  const [countdown] = useState(15 * 60); // 15 minutes in seconds
  
  const handleTabChange = (value: string) => {
    setActiveTab(value as PaymentMethod);
    onPaymentMethodChange(value as PaymentMethod);
  };
  
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CreditCard size={18} className="text-gray-700" />
          <h2 className="text-base font-semibold text-black">Pagamento</h2>
        </div>
        <span className="text-sm text-orange-500 font-medium">
          {activeTab === "card" ? "Cartão de crédito" : "Pix"}
        </span>
      </div>
      
      <Tabs 
        defaultValue="card" 
        value={activeTab}
        className="w-full"
        onValueChange={handleTabChange}
      >
        <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100 rounded-md border border-gray-200">
          <TabsTrigger 
            value="card" 
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-sm py-2.5 rounded-md"
          >
            <span className="mr-2">💳</span>
            Cartão de Crédito
          </TabsTrigger>
          <TabsTrigger 
            value="pix" 
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-sm py-2.5 rounded-md"
          >
            <span className="mr-2">📱</span>
            Pix
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="card" className="mt-0">
          <CardPaymentForm productValue={productValue} />
        </TabsContent>
        
        <TabsContent value="pix" className="mt-0">
          <PixPayment 
            pixConfig={pixConfig} 
            countdown={countdown} 
            productValue={produto?.valor ?? productValue} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
