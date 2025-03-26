
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Depoimento } from "@/lib/types/database-types";
import { DepoimentoCard } from "./DepoimentoCard";
import { NovoDepoimentoModal } from "./NovoDepoimentoModal";
import { EditarDepoimentoModal } from "./EditarDepoimentoModal";
import { AlertTriangle } from "lucide-react";

interface DepoimentosTabProps {
  depoimentos: Depoimento[];
  depoimentosSaving: boolean;
  handleDeleteTestimonial: (id: number) => Promise<void>;
  handleAddTestimonial: (depoimento: Omit<Depoimento, "id" | "criado_em">) => Promise<void>;
  handleUpdateTestimonial: (id: number, depoimento: Partial<Depoimento>) => Promise<void>;
}

export function DepoimentosTab({ 
  depoimentos, 
  depoimentosSaving, 
  handleDeleteTestimonial,
  handleAddTestimonial,
  handleUpdateTestimonial
}: DepoimentosTabProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDepoimento, setEditingDepoimento] = useState<Depoimento | null>(null);
  const [hasLoadedDepoimentos, setHasLoadedDepoimentos] = useState(false);

  useEffect(() => {
    // Verificar se os depoimentos foram carregados
    if (depoimentos && depoimentos.length > 0) {
      setHasLoadedDepoimentos(true);
    }
    
    console.log("DepoimentosTab - Depoimentos carregados:", depoimentos);
  }, [depoimentos]);

  const handleEditClick = (depoimento: Depoimento) => {
    setEditingDepoimento(depoimento);
    setIsEditModalOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Depoimentos</CardTitle>
        <CardDescription>
          Gerencie os depoimentos exibidos no checkout
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button variant="outline" onClick={() => setIsAddModalOpen(true)}>
            Adicionar Depoimento
          </Button>
        </div>
        
        <div className="space-y-4">
          {Array.isArray(depoimentos) && depoimentos.length > 0 ? (
            depoimentos.map((depoimento) => (
              <DepoimentoCard 
                key={depoimento.id || `temp-${Math.random()}`}
                depoimento={depoimento}
                onDelete={handleDeleteTestimonial}
                onEdit={handleEditClick}
                isProcessing={depoimentosSaving}
              />
            ))
          ) : depoimentosSaving ? (
            <div className="text-center py-8 text-gray-500">
              <div className="animate-pulse space-y-3">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
              <p className="mt-4">Carregando depoimentos...</p>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="flex flex-col items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-amber-500" />
                <p>Nenhum depoimento cadastrado.</p>
                <p className="text-sm">Clique em "Adicionar Depoimento" para começar.</p>
              </div>
            </div>
          )}
        </div>
        
        <NovoDepoimentoModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddTestimonial}
          isSaving={depoimentosSaving}
        />

        {editingDepoimento && (
          <EditarDepoimentoModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSubmit={(depoimento) => handleUpdateTestimonial(editingDepoimento.id, depoimento)}
            depoimento={editingDepoimento}
            isSaving={depoimentosSaving}
          />
        )}
      </CardContent>
    </Card>
  );
}
