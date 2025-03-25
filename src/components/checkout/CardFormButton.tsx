import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

interface CardFormButtonProps {
  formIsComplete: boolean;
  isSubmitting: boolean;
  onClick: () => void;
  buttonColor?: string;
  buttonTextColor?: string;
}

export function CardFormButton({
  formIsComplete,
  isSubmitting,
  onClick,
  buttonColor = "#8B5CF6",
  buttonTextColor = "#FFFFFF"
}: CardFormButtonProps) {
  // This component is no longer used directly
  // We're keeping it just to avoid import errors
  return null;
}
