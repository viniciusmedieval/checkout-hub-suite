
import { CreditCard, QrCode } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardPaymentForm } from "./CardPaymentForm";
import { PixPayment } from "./PixPayment";

interface PaymentMethodSelectorProps {
  productValue: number;
  pixConfig: {
    tipo_chave_pix: string;
    chave_pix: string;
    nome_beneficiario: string;
  } | null;
  onPaymentMethodChange: (method: 'card' | 'pix') => void;
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
  return (
    <div className="space-y-4">
      <Tabs 
        defaultValue="card" 
        className="w-full" 
        onValueChange={(value) => onPaymentMethodChange(value as 'card' | 'pix')}
      >
        <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100">
          <TabsTrigger 
            value="card" 
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-sm py-2"
          >
            <CreditCard size={14} className="mr-2" />
            Cartão
          </TabsTrigger>
          <TabsTrigger 
            value="pix" 
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-sm py-2"
          >
            <QrCode size={14} className="mr-2" />
            Pix
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="card" className="mt-0">
          <CardPaymentForm productValue={productValue} />
        </TabsContent>
        
        <TabsContent value="pix" className="mt-0">
          <PixPayment pixConfig={pixConfig} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
