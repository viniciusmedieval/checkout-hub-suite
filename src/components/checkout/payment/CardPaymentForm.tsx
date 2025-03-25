
import { useCardPaymentForm } from "@/hooks/checkout/useCardPaymentForm";
import { CardPaymentFormProps } from "./types";
import { CardFormSection } from "./card-form/CardFormSection";
import { CardSubmitSection } from "./card-form/CardSubmitSection";

export { type PaymentStatus } from "./types"; 

export function CardPaymentForm({ 
  productValue, 
  configCheckout, 
  onPaymentSubmit,
  customRedirectStatus 
}: CardPaymentFormProps) {
  const {
    cardNumber,
    cardName,
    cardExpiry,
    cardCVV,
    installments,
    isValid,
    formIsComplete,
    isSubmitting,
    setInstallments,
    handleCardNumberChange,
    handleCardNameChange,
    handleCardExpiryChange,
    handleCardCVVChange,
    handleSubmitPayment
  } = useCardPaymentForm(
    customRedirectStatus, 
    configCheckout ? {
      ...configCheckout,
      redirect_card_status: configCheckout.redirect_card_status as "analyzing" | "approved" | "rejected"
    } : null, 
    onPaymentSubmit
  );

  const validateCard = configCheckout?.validar_cartao === true;
  const maxInstallments = configCheckout?.max_installments || 12;
  
  return (
    <div className="space-y-3">
      <CardFormSection 
        cardNumber={cardNumber}
        cardName={cardName}
        cardExpiry={cardExpiry}
        cardCVV={cardCVV}
        installments={installments}
        isValid={isValid}
        productValue={productValue}
        maxInstallments={maxInstallments}
        validateCard={validateCard}
        handleCardNumberChange={handleCardNumberChange}
        handleCardNameChange={handleCardNameChange}
        handleCardExpiryChange={handleCardExpiryChange}
        handleCardCVVChange={handleCardCVVChange}
        setInstallments={setInstallments}
      />
      
      <CardSubmitSection 
        formIsComplete={formIsComplete}
        isSubmitting={isSubmitting}
        buttonColor={configCheckout?.cor_botao}
        buttonTextColor={configCheckout?.cor_texto_botao}
        handleSubmitPayment={handleSubmitPayment}
      />
    </div>
  );
}
