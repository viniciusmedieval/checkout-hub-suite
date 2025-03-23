
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
}

export function PaymentMethodSelector({ 
  productValue, 
  pixConfig, 
  onPaymentMethodChange 
}: PaymentMethodSelectorProps) {
  return (
    <Tabs 
      defaultValue="card" 
      className="w-full" 
      onValueChange={(value) => onPaymentMethodChange(value as 'card' | 'pix')}
    >
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="card" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
          <CreditCard size={16} className="mr-2" />
          Cartão de Crédito
        </TabsTrigger>
        <TabsTrigger value="pix" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
          <QrCode size={16} className="mr-2" />
          Pix
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="card">
        <CardPaymentForm productValue={productValue} />
      </TabsContent>
      
      <TabsContent value="pix">
        <PixPayment pixConfig={pixConfig} />
      </TabsContent>
    </Tabs>
  );
}
