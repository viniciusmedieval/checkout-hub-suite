
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Depoimento } from "@/lib/supabase";
import { DepoimentoCard } from "./DepoimentoCard";
import { NovoDepoimentoModal } from "./NovoDepoimentoModal";
import { EditarDepoimentoModal } from "./EditarDepoimentoModal";

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
          {depoimentos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum depoimento cadastrado.</p>
            </div>
          ) : (
            depoimentos.map((depoimento) => (
              <DepoimentoCard 
                key={depoimento.id}
                depoimento={depoimento}
                onDelete={handleDeleteTestimonial}
                onEdit={handleEditClick}
                isProcessing={depoimentosSaving}
              />
            ))
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
