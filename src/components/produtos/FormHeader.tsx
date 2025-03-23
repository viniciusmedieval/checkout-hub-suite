
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FormHeaderProps {
  isEditing: boolean;
  onClose: () => void;
}

export function FormHeader({ isEditing, onClose }: FormHeaderProps) {
  return (
    <div className="flex justify-between items-center pb-4 border-b mb-4">
      <h2 className="text-lg font-semibold">{isEditing ? 'Editar Produto' : 'Novo Produto'}</h2>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
