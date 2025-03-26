
import React from "react";
import { PixMensagem } from "@/lib/types/database-types";
import { PixMensagemItem } from "./PixMensagemItem";
import { PixMensagemForm } from "./PixMensagemForm";

interface PixMensagemListProps {
  messages: PixMensagem[];
  editingMessage: PixMensagem | null;
  isSaving: boolean;
  onEdit: (message: PixMensagem) => void;
  onCancelEdit: () => void;
  onDelete: (id: number) => void;
  onMoveUp: (message: PixMensagem) => void;
  onMoveDown: (message: PixMensagem) => void;
  onToggleActive: (message: PixMensagem) => void;
  onUpdateMessage: (field: string, value: string | boolean) => void;
  onSaveMessage: () => void;
}

export const PixMensagemList = ({
  messages,
  editingMessage,
  isSaving,
  onEdit,
  onCancelEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onToggleActive,
  onUpdateMessage,
  onSaveMessage
}: PixMensagemListProps) => {
  if (messages.length === 0) {
    return <p className="text-sm text-gray-500">Nenhuma mensagem cadastrada</p>;
  }

  return (
    <div className="space-y-3">
      {messages.map((message) => (
        <div key={message.id}>
          {editingMessage?.id === message.id ? (
            <PixMensagemForm
              message={editingMessage}
              onCancel={onCancelEdit}
              onChange={onUpdateMessage}
              onSave={onSaveMessage}
              isSaving={isSaving}
            />
          ) : (
            <PixMensagemItem
              message={message}
              onEdit={onEdit}
              onDelete={onDelete}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              onToggleActive={onToggleActive}
            />
          )}
        </div>
      ))}
    </div>
  );
};
