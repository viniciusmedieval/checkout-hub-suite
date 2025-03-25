
import { CardInput } from "./CardInput";
import { CardExpiryInput } from "./CardExpiryInput";
import { CardCVVInput } from "./CardCVVInput";
import { InstallmentSelector } from "./InstallmentSelector";
import { Input } from "@/components/ui/input";
import { User, CheckCircle2 } from "lucide-react";
import { FormValidationStatus } from "./FormValidationStatus";
import { useCardPaymentForm } from "@/hooks/checkout/useCardPaymentForm";
import { CardPaymentFormProps } from "./types";
import { Button } from "@/components/ui/button";

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
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          <User size={18} />
        </div>
        {isValid.cardName && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
            <CheckCircle2 size={16} />
          </div>
        )}
        <Input 
          id="cardName" 
          placeholder="Nome impresso no cartão" 
          className="pl-9 h-11 text-sm bg-white text-black rounded-lg" 
          value={cardName}
          onChange={handleCardNameChange}
        />
      </div>
      
      <CardInput 
        value={cardNumber}
        onChange={handleCardNumberChange}
        validateCard={validateCard}
      />
      
      <div className="grid grid-cols-2 gap-3">
        <CardExpiryInput
          value={cardExpiry}
          onChange={handleCardExpiryChange}
        />
        
        <CardCVVInput
          value={cardCVV}
          onChange={handleCardCVVChange}
        />
      </div>
      
      <InstallmentSelector
        productValue={productValue}
        value={installments}
        onChange={setInstallments}
        maxInstallments={maxInstallments}
      />
      
      <FormValidationStatus formIsComplete={formIsComplete} />
      
      <Button 
        className="w-full h-12 mt-4 font-medium rounded-lg"
        variant="default"
        style={{ backgroundColor: "#3B82F6", color: "#FFFFFF" }}
        disabled={!formIsComplete || isSubmitting}
        onClick={handleSubmitPayment}
      >
        {isSubmitting ? "Processando..." : "Pagar com Cartão"}
      </Button>
    </div>
  );
}
