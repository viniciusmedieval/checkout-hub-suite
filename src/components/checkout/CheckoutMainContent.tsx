
import { Produto, ConfigCheckout } from "@/lib/types/database-types";
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
  
  // Create a typed version of configCheckout with correct redirect_card_status type
  const typedConfigCheckout = configCheckout ? {
    ...configCheckout,
    redirect_card_status: configCheckout.redirect_card_status as PaymentStatus,
    modo_random: !!configCheckout.modo_random,
    max_installments: configCheckout.max_installments || 12
  } : null;

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
        configCheckout={typedConfigCheckout}
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
          configCheckout={typedConfigCheckout}
          customRedirectStatus={effectiveRedirectStatus}
          randomMode={typedConfigCheckout?.modo_random || false}
          onPaymentSubmit={submitOrder}
        />
      </div>
      
      <ResumoCompra 
        produto={produto} 
        configCheckout={typedConfigCheckout}
        visitorCount={visitorCount}
        isProcessing={isSubmitting}
        onCompletePurchase={submitOrder}
        paymentMethod={paymentMethod}
      />
    </div>
  );
}
