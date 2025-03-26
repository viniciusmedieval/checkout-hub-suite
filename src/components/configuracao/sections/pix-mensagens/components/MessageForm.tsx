
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PixMensagem } from "@/lib/types/database-types";

interface MessageFormProps {
  message: Partial<PixMensagem>;
  onCancel?: () => void;
  onChange: (field: string, value: string | boolean) => void;
  onSave: () => void;
  isSaving: boolean;
  isNewMessage?: boolean;
}

export const MessageForm: React.FC<MessageFormProps> = ({
  message,
  onCancel,
  onChange,
  onSave,
  isSaving,
  isNewMessage = false
}) => {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor={`edit-chave-${message.id || 'new'}`}>Chave</Label>
          <Input
            id={`edit-chave-${message.id || 'new'}`}
            value={message.chave || ''}
            onChange={(e) => onChange('chave', e.target.value)}
            placeholder="Ex: passo_4"
          />
        </div>
        <div>
          <Label htmlFor={`edit-titulo-${message.id || 'new'}`}>Título</Label>
          <Input
            id={`edit-titulo-${message.id || 'new'}`}
            value={message.titulo || ''}
            onChange={(e) => onChange('titulo', e.target.value)}
            placeholder="Ex: Passo 4"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor={`edit-texto-${message.id || 'new'}`}>Texto</Label>
        <Textarea
          id={`edit-texto-${message.id || 'new'}`}
          value={message.texto || ''}
          onChange={(e) => onChange('texto', e.target.value)}
          placeholder="Digite o texto da instrução..."
          rows={3}
        />
      </div>
      
      {!isNewMessage && (
        <div className="flex items-center space-x-2">
          <Switch
            id={`edit-active-${message.id}`}
            checked={message.ativo}
            onCheckedChange={(checked) => onChange('ativo', checked)}
          />
          <Label htmlFor={`edit-active-${message.id}`}>Ativo</Label>
        </div>
      )}
      
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onCancel}
          >
            Cancelar
          </Button>
        )}
        <Button 
          size="sm"
          onClick={onSave}
          disabled={isSaving || !message.chave || !message.titulo || !message.texto}
        >
          {isSaving ? 'Salvando...' : isNewMessage ? 'Adicionar' : 'Salvar Alterações'}
        </Button>
      </div>
    </div>
  );
};
