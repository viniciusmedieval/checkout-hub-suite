
import { CheckCircle2 } from "lucide-react";

interface FormValidationStatusProps {
  formIsComplete: boolean;
}

export function FormValidationStatus({ formIsComplete }: FormValidationStatusProps) {
  if (!formIsComplete) return null;
  
  return (
    <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
      <CheckCircle2 size={16} />
      <span>Informações do cartão validadas</span>
    </div>
  );
}
