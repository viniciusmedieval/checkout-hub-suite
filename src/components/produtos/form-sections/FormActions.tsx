
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isCreating: boolean;
  onCancel: () => void;
}

export function FormActions({ isCreating, onCancel }: FormActionsProps) {
  return (
    <div className="flex space-x-2">
      <Button type="submit">
        {isCreating ? "Criar" : "Salvar"}
      </Button>
      <Button
        type="button"
        variant="secondary"
        onClick={onCancel}
      >
        Cancelar
      </Button>
    </div>
  );
}
