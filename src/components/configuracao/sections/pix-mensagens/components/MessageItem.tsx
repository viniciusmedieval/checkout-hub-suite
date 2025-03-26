
import React from "react";
import { Button } from "@/components/ui/button";
import { PixMensagem } from "@/lib/types/database-types";
import { ArrowUp, ArrowDown, Edit, Trash } from "lucide-react";

interface MessageItemProps {
  message: PixMensagem;
  onEdit: (message: PixMensagem) => void;
  onDelete: (id: number) => void;
  onMoveUp: (message: PixMensagem) => void;
  onMoveDown: (message: PixMensagem) => void;
  onToggleActive: (message: PixMensagem) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onToggleActive
}) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{message.titulo}</h4>
          <p className="text-sm text-gray-500">Chave: {message.chave}</p>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onMoveUp(message)}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onMoveDown(message)}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onEdit(message)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-red-500"
            onClick={() => onDelete(message.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <p className="mt-2">{message.texto}</p>
      
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${message.ativo ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <span className="text-sm">{message.ativo ? 'Ativo' : 'Inativo'}</span>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onToggleActive(message)}
        >
          {message.ativo ? 'Desativar' : 'Ativar'}
        </Button>
      </div>
    </div>
  );
};
