
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

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
      onClick={onClick}
      disabled={!formIsComplete || isSubmitting}
      className="w-full mt-4 gap-2 h-11"
      style={{
        backgroundColor: buttonColor,
        color: buttonTextColor
      }}
    >
      {isSubmitting ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processando...
        </>
      ) : (
        <>
          <CreditCard size={18} />
          {buttonText}
        </>
      )}
    </Button>
  );
}
