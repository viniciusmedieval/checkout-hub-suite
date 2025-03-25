
import { ConfigCheckout } from "@/lib/supabase";

export type PaymentStatus = 'analyzing' | 'approved' | 'rejected';

export type CardFormData = {
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCVV: string;
  installments: string;
};

export interface CardPaymentFormProps {
  productValue: number;
  configCheckout?: ConfigCheckout | null;
  onPaymentSubmit?: (data: CardFormData) => void;
  customRedirectStatus?: PaymentStatus;
}
