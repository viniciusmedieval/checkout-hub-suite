
import React from "react";
import { Separator } from "@/components/ui/separator";
import { PixMensagem } from "@/lib/types/database-types";
import { MessageForm } from "./MessageForm";

interface AddMessageFormProps {
  newMessage: Partial<PixMensagem>;
  isSaving: boolean;
  onChange: (field: string, value: string | boolean) => void;
  onSave: () => void;
}

export const AddMessageForm: React.FC<AddMessageFormProps> = ({
  newMessage,
  isSaving,
  onChange,
  onSave
}) => {
  return (
    <div className="space-y-4">
      <Separator />
      
      <h3 className="text-lg font-medium">Adicionar Nova Mensagem</h3>
      
      <MessageForm
        message={newMessage}
        onChange={onChange}
        onSave={onSave}
        isSaving={isSaving}
        isNewMessage={true}
      />
    </div>
  );
};
