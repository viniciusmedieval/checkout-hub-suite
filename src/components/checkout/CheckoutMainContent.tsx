
import { Produto, ConfigCheckout } from "@/lib/supabase";
import { FormIdentificacao } from "@/components/checkout/FormIdentificacao";
import { PaymentMethodSelector } from "@/components/checkout/payment/selector/PaymentMethodSelector";
import { CheckoutTestimonials } from "@/components/checkout/CheckoutTestimonials";
import { ResumoCompra } from "@/components/checkout/ResumoCompra";
import { FormData } from "@/hooks/checkout";
import { PaymentStatus } from "@/components/checkout/payment/types";

interface CheckoutMainContentProps {
  produto: Produto;
  configCheckout?: ConfigCheckout | null;
  formData: FormData;
  formErrors: Record<string, boolean>;
  paymentMethod: 'card' | 'pix';
  isSubmitting: boolean;
  visitorCount: number;
  customRedirectStatus?: PaymentStatus;
  handleInputChange: (name: string, value: string) => void;
  setPaymentMethod: (method: 'card' | 'pix') => void;
  submitOrder: () => void;
}

export function CheckoutMainContent({
  produto,
  configCheckout,
  formData,
  formErrors,
  paymentMethod,
  isSubmitting,
  visitorCount,
  customRedirectStatus,
  handleInputChange,
  setPaymentMethod,
  submitOrder
}: CheckoutMainContentProps) {
  const textColor = configCheckout?.cor_titulo || "#000000";
  
  const effectiveRedirectStatus = customRedirectStatus || 
    (configCheckout?.redirect_card_status as PaymentStatus) || 
    'analyzing';
    
  const randomMode = configCheckout?.modo_random === true;

  return (
    <div className="w-full max-w-md mx-auto py-6 px-4 space-y-5">
      <h1 
        className="text-xl font-bold text-center"
        style={{ color: textColor }}
      >
        {produto.checkout_title || produto.nome}
      </h1>
      
      <FormIdentificacao 
        formData={formData} 
        errors={formErrors} 
        onChange={handleInputChange}
        configCheckout={configCheckout}
      />
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <CheckoutTestimonials produto_id={produto.id} />
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <PaymentMethodSelector 
          productValue={produto.valor}
          selectedMethod={paymentMethod}
          onMethodChange={setPaymentMethod}
          produto={produto}
          configCheckout={configCheckout}
          customRedirectStatus={effectiveRedirectStatus}
          randomMode={randomMode}
        />
      </div>
      
      <ResumoCompra 
        produto={produto} 
        configCheckout={configCheckout}
        visitorCount={visitorCount}
        isProcessing={isSubmitting}
        onCompletePurchase={submitOrder}
      />
    </div>
  );
}
