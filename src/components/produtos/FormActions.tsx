
import { Button } from "@/components/ui/button";

type FormActionsProps = {
  isSubmitting: boolean;
  isEditing: boolean;
  onClose: () => void;
};

export function FormActions({ isSubmitting, isEditing, onClose }: FormActionsProps) {
  return (
    <div className="flex justify-end gap-2 pt-4 border-t">
      <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <span className="animate-spin mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-loader-2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            </span>
            Salvando...
          </>
        ) : (
          isEditing ? 'Atualizar Produto' : 'Criar Produto'
        )}
      </Button>
    </div>
  );
}
