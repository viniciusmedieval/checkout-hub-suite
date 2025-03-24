
import { useCheckout } from "@/hooks/checkout";
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { CheckoutMainContent } from "@/components/checkout/CheckoutMainContent";
import { CheckoutFooter } from "@/components/checkout/CheckoutFooter";
import { CheckoutLoading } from "@/components/checkout/CheckoutLoading";
import { CheckoutError } from "@/components/checkout/CheckoutError";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Checkout = () => {
  const { slug } = useParams<{ slug: string }>();
  
  useEffect(() => {
    console.log("🔍 Checkout renderizado com slug:", slug);
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
