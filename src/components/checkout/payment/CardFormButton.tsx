
import { Button } from "@/components/ui/button";

interface CardFormButtonProps {
  formIsComplete: boolean;
  isSubmitting: boolean;
  onClick: () => void;
  buttonColor?: string;
  buttonTextColor?: string;
  buttonText?: string;
}

export function CardFormButton({
  formIsComplete,
  isSubmitting,
  onClick,
  buttonColor = "#8B5CF6",
  buttonTextColor = "#FFFFFF",
  buttonText = "Pagar com Cartão"
}: CardFormButtonProps) {
  return (
    <Button 
      type="button"
      disabled={!formIsComplete || isSubmitting}
      onClick={onClick}
      className="w-full py-6 text-base font-semibold relative"
      style={{ 
        backgroundColor: buttonColor,
        color: buttonTextColor,
        opacity: (!formIsComplete || isSubmitting) ? 0.7 : 1
      }}
    >
      {isSubmitting ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processando...
        </span>
      ) : buttonText}
    </Button>
  );
}
