
import { useState } from "react";
import { Produto, ConfigCheckout } from "@/lib/supabase";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { CheckoutTestimonials } from "@/components/checkout/CheckoutTestimonials";
import { ResumoCompra } from "@/components/checkout/ResumoCompra";
import { PaymentMethodSelector } from "@/components/checkout/payment/PaymentMethodSelector";
import { Shield } from "lucide-react";
import { useVisitorCounter } from "@/hooks/checkout/useVisitorCounter";

interface CheckoutContentProps {
  produto: Produto;
  configCheckout?: ConfigCheckout | null;
}

export function CheckoutContent({ produto, configCheckout }: CheckoutContentProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Use the visitor counter hook to get the current visitor count
  const { visitorCount } = useVisitorCounter(configCheckout);
  
  // Get title color from config, fallback to black if not set
  const titleColor = configCheckout?.cor_titulo || "#000000";
  
  // Pix configuration for the product
  const pixConfig = produto ? {
    tipo_chave_pix: produto.tipo_chave_pix,
    chave_pix: produto.chave_pix,
    nome_beneficiario: produto.nome_beneficiario
  } : null;

  // Handle purchase completion
  const handleCompletePurchase = () => {
    setIsProcessing(true);
    
    // Simulate a purchase process (replace with actual implementation)
    setTimeout(() => {
      setIsProcessing(false);
      // Additional logic for purchase completion can be added here
    }, 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto py-4 px-3 sm:py-6 sm:px-4 bg-white">
      <div className="space-y-4">
        {/* Product Title with configurable color */}
        <h1 
          className="text-xl font-bold text-center mb-2"
          style={{ color: titleColor }}
        >
          {produto.checkout_title || produto.nome}
        </h1>
        
        {/* Cliente Identification Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <CheckoutForm configCheckout={configCheckout} />
        </div>
        
        {/* Payment Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <PaymentMethodSelector 
            productValue={produto.valor} 
            pixConfig={pixConfig}
            onPaymentMethodChange={setPaymentMethod}
            produto={produto}
          />
        </div>
        
        {/* Testimonials Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <CheckoutTestimonials produto_id={produto.id} />
        </div>
        
        {/* Order Summary & CTA Button - Note: Border is now inside the ResumoCompra component */}
        <ResumoCompra 
          produto={produto} 
          configCheckout={configCheckout}
          visitorCount={visitorCount}
          isProcessing={isProcessing}
          onCompletePurchase={handleCompletePurchase} 
        />

        {/* Security Badge */}
        <div className="text-center">
          <p className="text-xs flex items-center justify-center gap-1.5 text-gray-500">
            <Shield size={12} />
            <span>Pagamento 100% seguro</span>
          </p>
        </div>
      </div>
    </div>
  );
}
