
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardPaymentForm } from "./CardPaymentForm";
import { PixPayment } from "./PixPayment";
import { PaymentMethod } from "@/hooks/useCheckout";
import { CreditCard } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
        <span className="text-sm text-black font-medium">
          {activeTab === "card" ? "Cartão de crédito" : "Pix"}
        </span>
      </div>
      
      <Tabs 
        defaultValue="card" 
        value={activeTab}
        className="w-full"
        onValueChange={handleTabChange}
      >
        <TabsList className="grid w-full grid-cols-2 mb-4 rounded-md border border-gray-100 p-0 overflow-hidden relative">
          <TabsTrigger 
            value="card" 
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-sm py-2.5 rounded-md"
          >
            <span className="mr-2">💳</span>
            Cartão de Crédito
          </TabsTrigger>
          <TabsTrigger 
            value="pix" 
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-sm py-2.5 rounded-md flex items-center justify-center"
          >
            <div className="flex items-center justify-center w-full">
              <img 
                src="/lovable-uploads/39a4f176-daeb-4a4b-8d5d-2e2e1995a1fa.png" 
                alt="Pix" 
                className="w-10 h-10 object-contain"
                loading="eager"
              />
            </div>
          </TabsTrigger>
          {/* Separator line between tab options */}
          <Separator 
            orientation="vertical" 
            className="absolute left-1/2 transform -translate-x-1/2 h-2/3 my-auto top-0 bottom-0 bg-gray-300/50 w-[1px]" 
          />
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
