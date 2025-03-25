
import { FormValidationStatus } from "../FormValidationStatus";
import { CardFormButton } from "../CardFormButton";

interface CardSubmitSectionProps {
  formIsComplete: boolean;
  isSubmitting: boolean;
  buttonColor?: string;
  buttonTextColor?: string;
  handleSubmitPayment: () => void;
}

export function CardSubmitSection({
  formIsComplete,
  isSubmitting, 
  buttonColor,
  buttonTextColor,
  handleSubmitPayment
}: CardSubmitSectionProps) {
  return (
    <div className="space-y-2">
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
