
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
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-sm py-2.5 rounded-md"
          >
            <span className="inline-flex items-center justify-center w-4 h-4 mr-2">
              <svg 
                viewBox="0 0 512 512" 
                className="w-full h-full"
                aria-hidden="true"
              >
                <path 
                  d="M242.525 418.907h25.811v-320h-25.811v320zm144.744-268.444h-88.727v25.811h88.746c11.968 0 21.7 9.714 21.7 21.7v71.72c0 11.968-9.714 21.7-21.7 21.7h-35.536v-40.413l-50.078 44.455 50.078 44.455v-40.413h35.536c36.739 0 66.598-29.877 66.598-66.598v-71.72c.019-36.739-29.859-66.616-66.598-66.616l-.019.019zm-292.343 0h-35.555c-36.739 0-66.598 29.877-66.598 66.598v71.72c0 36.739 29.877 66.598 66.598 66.598h88.727v-25.811h-88.727c-11.987 0-21.7-9.714-21.7-21.7v-71.72c0-11.968 9.714-21.7 21.7-21.7h35.555v40.413l50.078-44.455-50.078-44.455v40.432z" 
                  fill="#32BCAD"
                />
              </svg>
            </span>
            Pix
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
