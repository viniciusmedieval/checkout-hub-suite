
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export type PaymentStatus = 'analyzing' | 'approved' | 'rejected';

export function usePaymentStatus() {
  const { status } = useParams<{ status: string }>();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('analyzing');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Validar e definir o status a partir do parâmetro da URL
    if (status && ['analyzing', 'approved', 'rejected'].includes(status)) {
      setPaymentStatus(status as PaymentStatus);
    }
  }, [status]);
  
  // Função para controlar o redirecionamento manual para determinado status
  const redirectToStatus = (newStatus: PaymentStatus, slug?: string) => {
    const targetSlug = slug || 'default';
    navigate(`/payment-status/${targetSlug}/${newStatus}`);
  };

  return {
    paymentStatus,
    redirectToStatus
  };
}
