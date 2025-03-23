
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { Produto, supabase } from "@/lib/supabase";
import { PaymentMethodSelector } from "./payment/PaymentMethodSelector";
import { OrderSummary } from "./payment/OrderSummary";

interface CheckoutSummaryProps {
  produto: Produto;
}

interface PixConfig {
  tipo_chave_pix: string;
  chave_pix: string;
  nome_beneficiario: string;
}

export function CheckoutSummary({ produto }: CheckoutSummaryProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card');
  const [pixConfig, setPixConfig] = useState<PixConfig | null>(null);

  useEffect(() => {
    const fetchPixConfig = async () => {
      try {
        let { data: productPixConfig, error } = await supabase
          .from("pix_config")
          .select("*")
          .eq("produto_id", produto.id)
          .single();
        
        if (error || !productPixConfig) {
          const { data: globalConfig } = await supabase
            .from("pix_config")
            .select("*")
            .eq("is_global", true)
            .single();
          
          if (globalConfig) {
            setPixConfig(globalConfig);
          } else {
            setPixConfig({
              tipo_chave_pix: produto.tipo_chave_pix || 'email',
              chave_pix: produto.chave_pix || 'exemplo@email.com',
              nome_beneficiario: produto.nome_beneficiario || 'Loja Digital'
            });
          }
        } else {
          setPixConfig(productPixConfig);
        }
      } catch (error) {
        console.error("Error fetching PIX config:", error);
        setPixConfig({
          tipo_chave_pix: 'email',
          chave_pix: 'exemplo@email.com',
          nome_beneficiario: 'Loja Digital'
        });
      }
    };

    fetchPixConfig();
  }, [produto.id, produto.tipo_chave_pix, produto.chave_pix, produto.nome_beneficiario]);

  return (
    <div className="space-y-6">
      <Card className="checkout-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
              <CreditCard size={16} className="text-blue-600" />
            </div>
            <h3 className="checkout-heading">Pagamento</h3>
          </div>
          
          <PaymentMethodSelector 
            productValue={produto.valor}
            pixConfig={pixConfig}
            onPaymentMethodChange={setPaymentMethod}
          />
        </CardContent>
      </Card>
      
      <Card className="checkout-card">
        <CardContent className="p-6">
          <OrderSummary produto={produto} />
        </CardContent>
      </Card>
    </div>
  );
}
