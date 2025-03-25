
import { useCheckout } from "@/hooks/checkout";
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { CheckoutMainContent } from "@/components/checkout/CheckoutMainContent";
import { CheckoutFooter } from "@/components/checkout/CheckoutFooter";
import { CheckoutLoading } from "@/components/checkout/CheckoutLoading";
import { CheckoutError } from "@/components/checkout/CheckoutError";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PaymentStatus } from "@/components/checkout/payment/types";
import { Produto, ConfigCheckout } from "@/lib/types/database-types";

const Checkout = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [customRedirectStatus, setCustomRedirectStatus] = useState<PaymentStatus | undefined>(undefined);
  
  useEffect(() => {
    console.log("🔍 Checkout renderizado com slug:", slug);
    
    // Redirecionamento se não houver slug
    if (!slug) {
      console.error("❌ Nenhum slug fornecido para o checkout");
      navigate("/produtos");
      return;
    }
    
    // Carregar o status personalizado do localStorage
    if (slug) {
      try {
        const savedStatus = localStorage.getItem(`card_redirect_${slug}`);
        if (savedStatus && ['analyzing', 'approved', 'rejected'].includes(savedStatus)) {
          setCustomRedirectStatus(savedStatus as PaymentStatus);
          console.log("✅ Status de redirecionamento personalizado carregado:", savedStatus);
        }
      } catch (error) {
        console.error("Erro ao carregar status de redirecionamento:", error);
      }
    }
  }, [slug, navigate]);
  
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
      // Registrar visualização ou outras métricas aqui
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

  // Cast produto and configCheckout to the correct types
  const typedProduto = produto as unknown as Produto;
  const typedConfigCheckout = configCheckout ? {
    ...configCheckout,
    redirect_card_status: configCheckout.redirect_card_status as PaymentStatus
  } as unknown as ConfigCheckout : null;

  // Determinar a cor de fundo a ser usada (default: white)
  const backgroundColor = typedProduto.background_color || typedConfigCheckout?.cor_fundo || "#FFFFFF";
  
  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor }}
    >
      {/* Header: contém tanto a barra de mensagem quanto o banner */}
      <CheckoutHeader produto={typedProduto} configCheckout={typedConfigCheckout} />

      {/* Main checkout content */}
      <div className="flex-grow flex justify-center">
        <CheckoutMainContent 
          produto={typedProduto}
          configCheckout={typedConfigCheckout}
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
      <CheckoutFooter configCheckout={typedConfigCheckout} />
    </div>
  );
}

export default Checkout;
