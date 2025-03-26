
import React from "react";
import { PixMensagem } from "@/lib/types/database-types";
import { Separator } from "@/components/ui/separator";
import { PixMensagemForm } from "./PixMensagemForm";

interface AddPixMensagemProps {
  newMessage: Partial<PixMensagem>;
  isSaving: boolean;
  onChange: (field: string, value: string | boolean) => void;
  onSave: () => void;
}

export const AddPixMensagem = ({
  newMessage,
  isSaving,
  onChange,
  onSave
}: AddPixMensagemProps) => {
  return (
    <div className="space-y-4">
      <Separator />
      
      <h3 className="text-lg font-medium">Adicionar Nova Mensagem</h3>
      
      <PixMensagemForm
        message={newMessage}
        onChange={onChange}
        onSave={onSave}
        isSaving={isSaving}
        isNewMessage={true}
      />
    </div>
  );
};
