
import { useCheckout } from "@/hooks/checkout";
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { CheckoutMainContent } from "@/components/checkout/CheckoutMainContent";
import { CheckoutFooter } from "@/components/checkout/CheckoutFooter";
import { CheckoutLoading } from "@/components/checkout/CheckoutLoading";
import { CheckoutError } from "@/components/checkout/CheckoutError";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PaymentStatus } from "@/components/checkout/payment/CardPaymentForm";

const Checkout = () => {
  const { slug } = useParams<{ slug: string }>();
  const [customRedirectStatus, setCustomRedirectStatus] = useState<PaymentStatus | undefined>(undefined);
  
  useEffect(() => {
    console.log("🔍 Checkout renderizado com slug:", slug);
    
    // Carregar o status personalizado do localStorage
    if (slug) {
      const savedStatus = localStorage.getItem(`card_redirect_${slug}`);
      if (savedStatus && ['analyzing', 'approved', 'rejected'].includes(savedStatus)) {
        setCustomRedirectStatus(savedStatus as PaymentStatus);
        console.log("✅ Status de redirecionamento personalizado carregado:", savedStatus);
      }
    }
  }, [slug]);
  
  const { 
    produto, 
    configCheckout, 
    loading, 
    error,
    formData,
    formErrors,
    paymentMethod,
    isSubmitting,
    countdown,
    visitorCount,
    handleInputChange,
    setPaymentMethod,
    submitOrder
  } = useCheckout();

  useEffect(() => {
    if (produto) {
      console.log("✅ Produto carregado:", { id: produto.id, nome: produto.nome, slug: produto.slug });
    }
    if (error) {
      console.error("❌ Erro ao carregar produto:", error);
    }
  }, [produto, error]);

  if (loading) {
    return <CheckoutLoading />;
  }

  if (error || !produto) {
    return <CheckoutError error={error} />;
  }

  // Determinar a cor de fundo a ser usada (default: white)
  const backgroundColor = produto.background_color || configCheckout?.cor_fundo || "#FFFFFF";
  
  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor }}
    >
      {/* Header: contém tanto a barra de mensagem quanto o banner */}
      <CheckoutHeader produto={produto} configCheckout={configCheckout} />

      {/* Main checkout content */}
      <div className="flex-grow flex justify-center">
        <CheckoutMainContent 
          produto={produto}
          configCheckout={configCheckout}
          formData={formData}
          formErrors={formErrors}
          paymentMethod={paymentMethod}
          isSubmitting={isSubmitting}
          visitorCount={visitorCount}
          customRedirectStatus={customRedirectStatus}
          handleInputChange={handleInputChange}
          setPaymentMethod={setPaymentMethod}
          submitOrder={submitOrder}
        />
      </div>
      
      {/* Footer */}
      <CheckoutFooter configCheckout={configCheckout} />
    </div>
  );
}

export default Checkout;
