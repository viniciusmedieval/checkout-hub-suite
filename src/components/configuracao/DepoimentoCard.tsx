
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Depoimento } from "@/lib/supabase";
import { Edit, Trash } from "lucide-react";
import { StarRating } from "../checkout/testimonials/StarRating";

interface DepoimentoCardProps {
  depoimento: Depoimento;
  onDelete: (id: number) => Promise<void>;
  onEdit: (depoimento: Depoimento) => void;
  isProcessing: boolean;
}

export function DepoimentoCard({ depoimento, onDelete, onEdit, isProcessing }: DepoimentoCardProps) {
  return (
    <Card className="overflow-hidden border border-border">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-24 h-24 bg-secondary flex-shrink-0">
          <img 
            src={depoimento.foto_url} 
            alt={depoimento.nome} 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(depoimento.nome)}&background=random`;
            }}
          />
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{depoimento.nome}</h3>
            <div className="flex">
              <StarRating rating={depoimento.estrelas} />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{depoimento.texto}</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit(depoimento)}
              disabled={isProcessing}
            >
              <Edit size={16} className="mr-1" /> Editar
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => onDelete(depoimento.id)}
              disabled={isProcessing}
            >
              <Trash size={16} className="mr-1" /> Excluir
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
