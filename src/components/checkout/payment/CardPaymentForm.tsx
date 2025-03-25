
import { CardInput } from "./CardInput";
import { CardExpiryInput } from "./CardExpiryInput";
import { CardCVVInput } from "./CardCVVInput";
import { InstallmentSelector } from "./InstallmentSelector";
import { Input } from "@/components/ui/input";
import { User, CheckCircle2 } from "lucide-react";
import { FormValidationStatus } from "./FormValidationStatus";
import { CardFormButton } from "./CardFormButton";
import { useCardPaymentForm } from "@/hooks/checkout/useCardPaymentForm";
import { CardPaymentFormProps } from "./types";

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
  } = useCardPaymentForm(customRedirectStatus, configCheckout, onPaymentSubmit);

  const validateCard = configCheckout?.validar_cartao === true;
  const buttonColor = configCheckout?.cor_botao || "#8B5CF6";
  const buttonTextColor = configCheckout?.cor_texto_botao || "#FFFFFF";
  
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
      />
      
      <FormValidationStatus formIsComplete={formIsComplete} />
      
      <CardFormButton 
        formIsComplete={formIsComplete}
        isSubmitting={isSubmitting}
        onClick={handleSubmitPayment}
        buttonColor={buttonColor}
        buttonTextColor={buttonTextColor}
      />
    </div>
  );
}
