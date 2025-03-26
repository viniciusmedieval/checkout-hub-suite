
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { usePixMensagens } from "./hooks/usePixMensagens";
import { PixMensagemList } from "./components/PixMensagemList";
import { AddPixMensagem } from "./components/AddPixMensagem";

export function PixMensagensManager() {
  const {
    messages,
    loading,
    editingMessage,
    newMessage,
    isSaving,
    handleCreateMessage,
    handleUpdateMessage,
    handleDeleteMessage,
    handleMoveUp,
    handleMoveDown,
    handleToggleActive,
    handleEditMessage,
    handleCancelEdit,
    handleUpdateEditingMessage,
    handleUpdateNewMessage
  } = usePixMensagens();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Instruções de Pagamento PIX</CardTitle>
        <CardDescription>
          Configure as mensagens que serão exibidas para o cliente na tela de pagamento PIX
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="flex justify-center p-4">
            <p>Carregando mensagens...</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Mensagens Existentes</h3>
              
              <PixMensagemList
                messages={messages}
                editingMessage={editingMessage}
                isSaving={isSaving}
                onEdit={handleEditMessage}
                onCancelEdit={handleCancelEdit}
                onDelete={handleDeleteMessage}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onToggleActive={handleToggleActive}
                onUpdateMessage={handleUpdateEditingMessage}
                onSaveMessage={handleUpdateMessage}
              />
            </div>
            
            <AddPixMensagem
              newMessage={newMessage}
              isSaving={isSaving}
              onChange={handleUpdateNewMessage}
              onSave={handleCreateMessage}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
