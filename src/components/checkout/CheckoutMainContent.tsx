
import { Produto, ConfigCheckout } from "@/lib/supabase";
import { FormIdentificacao } from "@/components/checkout/FormIdentificacao";
import { PaymentMethodSelector } from "@/components/checkout/payment/PaymentMethodSelector";
import { CheckoutTestimonials } from "@/components/checkout/CheckoutTestimonials";
import { ResumoCompra } from "@/components/checkout/ResumoCompra";
import { FormData } from "@/hooks/checkout";

interface CheckoutMainContentProps {
  produto: Produto;
  configCheckout?: ConfigCheckout | null;
  formData: FormData;
  formErrors: Record<string, boolean>;
  paymentMethod: 'card' | 'pix';
  isSubmitting: boolean;
  visitorCount: number;
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
  handleInputChange,
  setPaymentMethod,
  submitOrder
}: CheckoutMainContentProps) {
  // Determinar a cor do texto a ser usada (default: black)
  const textColor = configCheckout?.cor_titulo || "#000000";

  return (
    <div className="w-full max-w-md mx-auto py-6 px-4 space-y-5">
      {/* Product Title with configurable color */}
      <h1 
        className="text-xl font-bold text-center"
        style={{ color: textColor }}
      >
        {produto.checkout_title || produto.nome}
      </h1>
      
      {/* Cliente Identification Form */}
      <FormIdentificacao 
        formData={formData} 
        errors={formErrors} 
        onChange={handleInputChange}
        configCheckout={configCheckout}
      />
      
      {/* Testimonials Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <CheckoutTestimonials produto_id={produto.id} />
      </div>
      
      {/* Payment Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <PaymentMethodSelector 
          productValue={produto.valor}
          selectedMethod={paymentMethod}
          onMethodChange={setPaymentMethod}
          produto={produto}
          configCheckout={configCheckout}
        />
      </div>
      
      {/* Order Summary & CTA Button */}
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
