
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCheckoutData } from "@/hooks/useCheckoutData";
import { usePaymentStatus } from "@/hooks/checkout";
import { PaymentStatusContent } from "@/components/payment-status/PaymentStatusContent";
import { toast } from "sonner";

const PaymentStatus = () => {
  const { slug, status } = useParams<{ slug: string; status: string }>();
  const navigate = useNavigate();
  const { paymentStatus, redirectToStatus } = usePaymentStatus();
  const { produto, configCheckout, loading, error } = useCheckoutData(slug);
  
  useEffect(() => {
    // Verifica parâmetros
    if (!slug || !status) {
      console.error("Parâmetros inválidos para a página de status:", { slug, status });
      toast.error("Informações de pagamento inválidas");
      navigate("/produtos");
      return;
    }
    
    // Registra o status da página para debugging
    console.log("💳 Página de status de pagamento:", { 
      slug, 
      status, 
      paymentStatus,
      produto: produto?.nome,
      configCheckout: configCheckout?.redirect_card_status
    });
    
    // Verifica status válido
    if (status && !['analyzing', 'approved', 'rejected'].includes(status)) {
      console.warn(`Status inválido: ${status}, redirecionando para 'analyzing'`);
      toast.warning("Status de pagamento inválido, redirecionando...");
      redirectToStatus(slug, 'analyzing');
    }
  }, [slug, status, paymentStatus, produto, navigate, redirectToStatus]);
  
  // Handlers para as ações do usuário
  const handleTryAgain = () => {
    if (slug) {
      navigate(`/checkout/${slug}`);
    } else {
      navigate('/produtos');
    }
  };
  
  const handleReturn = () => {
    navigate('/produtos');
  };
  
  // Função para exibir um componente de loading enquanto os dados são carregados
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  // Se ocorrer algum erro, redirecionar para recusado
  if (error || !produto) {
    // Notifica o usuário sobre o erro
    toast.error("Produto não encontrado ou erro ao carregar os dados");
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <PaymentStatusContent
          status="rejected"
          configCheckout={configCheckout}
          productName="produto não encontrado"
          errorMessage={error || "Produto não encontrado"}
          onTryAgain={handleTryAgain}
          onReturn={handleReturn}
        />
      </div>
    );
  }
  
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: configCheckout?.cor_fundo || "#f9fafb" }}
    >
      <PaymentStatusContent
        status={paymentStatus}
        configCheckout={configCheckout}
        productName={produto.nome}
        orderNumber={`#${Math.floor(100000 + Math.random() * 900000)}`}
        onTryAgain={handleTryAgain}
        onReturn={handleReturn}
      />
    </div>
  );
};

export default PaymentStatus;
