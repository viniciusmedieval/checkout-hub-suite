import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Trash, Save, Edit, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { PixMensagem } from "@/lib/types/database-types";
import { supabase } from "@/integrations/supabase/client";

export function PixMensagensManager() {
  const [messages, setMessages] = useState<PixMensagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMessage, setEditingMessage] = useState<PixMensagem | null>(null);
  const [newMessage, setNewMessage] = useState<Partial<PixMensagem>>({
    chave: "",
    titulo: "",
    texto: "",
    ativo: true,
    ordem: 0
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("pix_mensagens")
        .select("*")
        .order("ordem");

      if (error) {
        throw error;
      }

      if (data) {
        setMessages(data);
      }
    } catch (error: any) {
      console.error("Erro ao carregar mensagens PIX:", error);
      toast.error("Erro ao carregar mensagens PIX");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleCreateMessage = async () => {
    try {
      if (!newMessage.chave || !newMessage.titulo || !newMessage.texto) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }

      setIsSaving(true);
      
      if (!newMessage.ordem) {
        newMessage.ordem = messages.length > 0 
          ? Math.max(...messages.map(msg => msg.ordem)) + 1 
          : 1;
      }

      const { data, error } = await supabase
        .from("pix_mensagens")
        .insert({
          chave: newMessage.chave,
          titulo: newMessage.titulo,
          texto: newMessage.texto,
          ativo: newMessage.ativo,
          ordem: newMessage.ordem
        })
        .select();

      if (error) {
        throw error;
      }

      if (data) {
        setMessages([...messages, data[0]]);
        setNewMessage({
          chave: "",
          titulo: "",
          texto: "",
          ativo: true,
          ordem: 0
        });
        toast.success("Mensagem PIX criada com sucesso");
      }
    } catch (error: any) {
      console.error("Erro ao criar mensagem PIX:", error);
      toast.error("Erro ao criar mensagem PIX");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateMessage = async () => {
    try {
      if (!editingMessage || !editingMessage.id) {
        return;
      }

      if (!editingMessage.chave || !editingMessage.titulo || !editingMessage.texto) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }

      setIsSaving(true);

      const { data, error } = await supabase
        .from("pix_mensagens")
        .update({
          chave: editingMessage.chave,
          titulo: editingMessage.titulo,
          texto: editingMessage.texto,
          ativo: editingMessage.ativo,
          ordem: editingMessage.ordem
        })
        .eq("id", editingMessage.id)
        .select();

      if (error) {
        throw error;
      }

      if (data) {
        setMessages(messages.map(msg => 
          msg.id === editingMessage.id ? data[0] : msg
        ));
        setEditingMessage(null);
        toast.success("Mensagem PIX atualizada com sucesso");
      }
    } catch (error: any) {
      console.error("Erro ao atualizar mensagem PIX:", error);
      toast.error("Erro ao atualizar mensagem PIX");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMessage = async (id: number) => {
    try {
      if (!window.confirm("Tem certeza que deseja excluir esta mensagem?")) {
        return;
      }

      setIsSaving(true);

      const { error } = await supabase
        .from("pix_mensagens")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      setMessages(messages.filter(msg => msg.id !== id));
      toast.success("Mensagem PIX excluída com sucesso");
    } catch (error: any) {
      console.error("Erro ao excluir mensagem PIX:", error);
      toast.error("Erro ao excluir mensagem PIX");
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveUp = async (message: PixMensagem) => {
    try {
      const index = messages.findIndex(msg => msg.id === message.id);
      if (index <= 0) return; // Already at the top
      
      setIsSaving(true);
      
      const previousMessage = messages[index - 1];
      
      const updates = [
        { id: message.id, ordem: previousMessage.ordem },
        { id: previousMessage.id, ordem: message.ordem }
      ];
      
      for (const update of updates) {
        const { error } = await supabase
          .from("pix_mensagens")
          .update({ ordem: update.ordem })
          .eq("id", update.id);
          
        if (error) throw error;
      }
      
      const newMessages = [...messages];
      newMessages[index] = { ...newMessages[index], ordem: previousMessage.ordem };
      newMessages[index - 1] = { ...newMessages[index - 1], ordem: message.ordem };
      
      newMessages.sort((a, b) => a.ordem - b.ordem);
      setMessages(newMessages);
      
      toast.success("Ordem atualizada com sucesso");
    } catch (error: any) {
      console.error("Erro ao atualizar ordem:", error);
      toast.error("Erro ao atualizar ordem");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleMoveDown = async (message: PixMensagem) => {
    try {
      const index = messages.findIndex(msg => msg.id === message.id);
      if (index >= messages.length - 1) return; // Already at the bottom
      
      setIsSaving(true);
      
      const nextMessage = messages[index + 1];
      
      const updates = [
        { id: message.id, ordem: nextMessage.ordem },
        { id: nextMessage.id, ordem: message.ordem }
      ];
      
      for (const update of updates) {
        const { error } = await supabase
          .from("pix_mensagens")
          .update({ ordem: update.ordem })
          .eq("id", update.id);
          
        if (error) throw error;
      }
      
      const newMessages = [...messages];
      newMessages[index] = { ...newMessages[index], ordem: nextMessage.ordem };
      newMessages[index + 1] = { ...newMessages[index + 1], ordem: message.ordem };
      
      newMessages.sort((a, b) => a.ordem - b.ordem);
      setMessages(newMessages);
      
      toast.success("Ordem atualizada com sucesso");
    } catch (error: any) {
      console.error("Erro ao atualizar ordem:", error);
      toast.error("Erro ao atualizar ordem");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (message: PixMensagem) => {
    try {
      setIsSaving(true);
      
      const { data, error } = await supabase
        .from("pix_mensagens")
        .update({ ativo: !message.ativo })
        .eq("id", message.id)
        .select();
        
      if (error) throw error;
      
      if (data) {
        setMessages(messages.map(msg => 
          msg.id === message.id ? data[0] : msg
        ));
        toast.success(`Mensagem ${data[0].ativo ? 'ativada' : 'desativada'} com sucesso`);
      }
    } catch (error: any) {
      console.error("Erro ao atualizar status da mensagem:", error);
      toast.error("Erro ao atualizar status da mensagem");
    } finally {
      setIsSaving(false);
    }
  };

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
              
              {messages.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhuma mensagem cadastrada</p>
              ) : (
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div key={message.id} className="border rounded-lg p-4">
                      {editingMessage?.id === message.id ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor={`edit-chave-${message.id}`}>Chave</Label>
                              <Input
                                id={`edit-chave-${message.id}`}
                                value={editingMessage.chave}
                                onChange={(e) => 
                                  setEditingMessage({...editingMessage, chave: e.target.value})
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor={`edit-titulo-${message.id}`}>Título</Label>
                              <Input
                                id={`edit-titulo-${message.id}`}
                                value={editingMessage.titulo}
                                onChange={(e) => 
                                  setEditingMessage({...editingMessage, titulo: e.target.value})
                                }
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor={`edit-texto-${message.id}`}>Texto</Label>
                            <Textarea
                              id={`edit-texto-${message.id}`}
                              value={editingMessage.texto}
                              onChange={(e) => 
                                setEditingMessage({...editingMessage, texto: e.target.value})
                              }
                              rows={3}
                            />
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`edit-active-${message.id}`}
                              checked={editingMessage.ativo}
                              onCheckedChange={(checked) => 
                                setEditingMessage({...editingMessage, ativo: checked})
                              }
                            />
                            <Label htmlFor={`edit-active-${message.id}`}>Ativo</Label>
                          </div>
                          
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingMessage(null)}
                            >
                              Cancelar
                            </Button>
                            <Button 
                              size="sm"
                              onClick={handleUpdateMessage}
                              disabled={isSaving}
                            >
                              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{message.titulo}</h4>
                              <p className="text-sm text-gray-500">Chave: {message.chave}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleMoveUp(message)}
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleMoveDown(message)}
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setEditingMessage(message)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-red-500"
                                onClick={() => handleDeleteMessage(message.id)}
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
                              onClick={() => handleToggleActive(message)}
                            >
                              {message.ativo ? 'Desativar' : 'Ativar'}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Adicionar Nova Mensagem</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="new-chave">Chave</Label>
                  <Input
                    id="new-chave"
                    value={newMessage.chave}
                    onChange={(e) => setNewMessage({...newMessage, chave: e.target.value})}
                    placeholder="Ex: passo_4"
                  />
                </div>
                <div>
                  <Label htmlFor="new-titulo">Título</Label>
                  <Input
                    id="new-titulo"
                    value={newMessage.titulo}
                    onChange={(e) => setNewMessage({...newMessage, titulo: e.target.value})}
                    placeholder="Ex: Passo 4"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="new-texto">Texto</Label>
                <Textarea
                  id="new-texto"
                  value={newMessage.texto}
                  onChange={(e) => setNewMessage({...newMessage, texto: e.target.value})}
                  placeholder="Digite o texto da instrução..."
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleCreateMessage}
                  disabled={isSaving || !newMessage.chave || !newMessage.titulo || !newMessage.texto}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isSaving ? 'Adicionando...' : 'Adicionar Mensagem'}
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
