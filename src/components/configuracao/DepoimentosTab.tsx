
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Depoimento } from "@/lib/supabase";
import { DepoimentoCard } from "./DepoimentoCard";
import { NovoDepoimentoModal } from "./NovoDepoimentoModal";

interface DepoimentosTabProps {
  depoimentos: Depoimento[];
  depoimentosSaving: boolean;
  handleDeleteTestimonial: (id: number) => Promise<void>;
  handleAddTestimonial: (depoimento: Omit<Depoimento, "id" | "criado_em">) => Promise<void>;
}

export function DepoimentosTab({ 
  depoimentos, 
  depoimentosSaving, 
  handleDeleteTestimonial,
  handleAddTestimonial
}: DepoimentosTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <Button variant="outline" onClick={() => setIsModalOpen(true)}>
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
                isDeleting={depoimentosSaving}
              />
            ))
          )}
        </div>
        
        <NovoDepoimentoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddTestimonial}
          isSaving={depoimentosSaving}
        />
      </CardContent>
    </Card>
  );
}
