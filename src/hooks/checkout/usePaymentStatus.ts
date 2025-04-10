
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export type PaymentStatus = 'analyzing' | 'approved' | 'rejected';

export const usePaymentStatus = () => {
  const { status } = useParams<{ status?: string }>();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('analyzing');
  const navigate = useNavigate();

  useEffect(() => {
    if (status) {
      if (['analyzing', 'approved', 'rejected'].includes(status)) {
        setPaymentStatus(status as PaymentStatus);
      } else {
        console.warn(`Status inválido recebido: ${status}, redirecionando para 'analyzing'`);
        setPaymentStatus('analyzing');
      }
    }
  }, [status]);

  const redirectToStatus = (slug: string, newStatus: PaymentStatus) => {
    if (slug) {
      navigate(`/payment-status/${slug}/${newStatus}`);
    }
  };

  // Add the simulatePayment function that was missing
  const simulatePayment = (status: PaymentStatus, slug: string) => {
    console.log(`Simulando pagamento com status: ${status} para slug: ${slug}`);
    redirectToStatus(slug, status);
  };

  return {
    paymentStatus,
    redirectToStatus,
    simulatePayment
  };
};

export default usePaymentStatus;
