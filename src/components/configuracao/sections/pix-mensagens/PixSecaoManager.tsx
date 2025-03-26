import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Save } from "lucide-react";
import { toast } from "sonner";
import { PixSecao, ConfigCheckout } from "@/lib/types/database-types";
import { supabase } from "@/integrations/supabase/client";

interface PixSecaoManagerProps {
  config: ConfigCheckout;
  onConfigUpdate: (updatedConfig: Partial<ConfigCheckout>) => void;
}

export function PixSecaoManager({ config, onConfigUpdate }: PixSecaoManagerProps) {
  const [secoes, setSecoes] = useState<PixSecao[]>([]);
  const [selectedSecao, setSelectedSecao] = useState<PixSecao | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch all PIX sections from the database
  const fetchSecoes = async () => {
    try {
      setLoading(true);
      console.log("Fetching PIX sections");

      const { data, error } = await supabase
        .from("pix_secoes")
        .select("*")
        .order("id");

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      if (data) {
        console.log("Fetched PIX sections:", data);
        setSecoes(data);
        
        // If config has a pix_secao_id, select that section
        if (config.pix_secao_id) {
          const selectedSecao = data.find(s => s.id === config.pix_secao_id);
          if (selectedSecao) {
            console.log("Selected section from config:", selectedSecao);
            setSelectedSecao(selectedSecao);
          } else if (data.length > 0) {
            console.log("Selected first section as fallback:", data[0]);
            setSelectedSecao(data[0]);
          }
        } else if (data.length > 0) {
          // Otherwise select the first section
          console.log("Selected first section:", data[0]);
          setSelectedSecao(data[0]);
        }
      }
    } catch (error: any) {
      console.error("Erro ao carregar seções PIX:", error);
      toast.error("Erro ao carregar seções PIX: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecoes();
  }, [config.pix_secao_id]);

  // Update the selected section
  const handleUpdateSecao = async () => {
    try {
      if (!selectedSecao || !selectedSecao.id) {
        toast.error("Nenhuma seção selecionada");
        return;
      }

      setIsSaving(true);
      console.log("Updating PIX section:", selectedSecao);

      const { data, error } = await supabase
        .from("pix_secoes")
        .update({
          titulo: selectedSecao.titulo,
          subtitulo: selectedSecao.subtitulo,
          descricao: selectedSecao.descricao,
          botao_texto: selectedSecao.botao_texto,
          info_pagamento: selectedSecao.info_pagamento,
          paragrafo_principal: selectedSecao.paragrafo_principal,
          paragrafo_secundario: selectedSecao.paragrafo_secundario,
          texto_valor_vista: selectedSecao.texto_valor_vista,
          mostrar_contador: selectedSecao.mostrar_contador,
          texto_contador: selectedSecao.texto_contador
        })
        .eq("id", selectedSecao.id)
        .select();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      if (data) {
        console.log("Updated PIX section:", data);
        // Update the selected section in the list
        setSecoes(secoes.map(s => 
          s.id === selectedSecao.id ? data[0] : s
        ));
        
        // Update the config with the selected section ID
        if (config.pix_secao_id !== selectedSecao.id) {
          console.log("Updating config with pix_secao_id:", selectedSecao.id);
          onConfigUpdate({ pix_secao_id: selectedSecao.id });
        }
        
        toast.success("Seção PIX atualizada com sucesso");
      }
    } catch (error: any) {
      console.error("Erro ao atualizar seção PIX:", error);
      toast.error("Erro ao atualizar seção PIX: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle selection of a different section
  const handleSelectSecao = (secao: PixSecao) => {
    console.log("Selected section:", secao);
    setSelectedSecao(secao);
    onConfigUpdate({ pix_secao_id: secao.id });
  };

  // Create a new section
  const handleCreateSecao = async () => {
    try {
      setIsSaving(true);
      console.log("Creating new PIX section");

      const { data, error } = await supabase
        .from("pix_secoes")
        .insert([{
          titulo: "Nova Seção",
          subtitulo: "Subtítulo da seção",
          descricao: "Descrição da seção",
          botao_texto: "Pagar com PIX",
          info_pagamento: "Informações sobre o pagamento via PIX",
          paragrafo_principal: "O pagamento é instantâneo e liberação imediata.",
          paragrafo_secundario: "Ao clicar em 'Pagar com PIX' você será encaminhado para um ambiente seguro.",
          texto_valor_vista: "Valor à vista:",
          mostrar_contador: true,
          texto_contador: "{count} visitantes estão finalizando a compra neste momento."
        }])
        .select();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      if (data) {
        console.log("Created PIX section:", data);
        setSecoes([...secoes, data[0]]);
        setSelectedSecao(data[0]);
        onConfigUpdate({ pix_secao_id: data[0].id });
        toast.success("Nova seção PIX criada com sucesso");
      }
    } catch (error: any) {
      console.error("Erro ao criar seção PIX:", error);
      toast.error("Erro ao criar seção PIX: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center p-6">
          <p>Carregando configurações...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração da Seção de Pagamento PIX</CardTitle>
        <CardDescription>
          Personalize os textos e opções da seção de pagamento PIX
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {secoes.length === 0 ? (
          <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-gray-50">
            <AlertCircle className="w-12 h-12 text-blue-500" />
            <p className="text-center">Nenhuma seção PIX encontrada. Crie uma nova seção para começar.</p>
            <Button onClick={handleCreateSecao}>Criar Seção PIX</Button>
          </div>
        ) : (
          <>
            {/* Section Selector */}
            <div className="space-y-2">
              <Label>Selecione a Seção PIX</Label>
              <div className="flex flex-wrap gap-2">
                {secoes.map((secao) => (
                  <Button
                    key={secao.id}
                    variant={selectedSecao?.id === secao.id ? "default" : "outline"}
                    onClick={() => handleSelectSecao(secao)}
                  >
                    {secao.titulo}
                  </Button>
                ))}
                <Button variant="ghost" onClick={handleCreateSecao}>+ Nova Seção</Button>
              </div>
            </div>
            
            <Separator />
            
            {selectedSecao && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="secao-titulo">Título da Seção</Label>
                    <Input
                      id="secao-titulo"
                      value={selectedSecao.titulo}
                      onChange={(e) => setSelectedSecao({...selectedSecao, titulo: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secao-subtitulo">Subtítulo</Label>
                    <Input
                      id="secao-subtitulo"
                      value={selectedSecao.subtitulo || ""}
                      onChange={(e) => setSelectedSecao({...selectedSecao, subtitulo: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secao-descricao">Descrição</Label>
                  <Textarea
                    id="secao-descricao"
                    value={selectedSecao.descricao || ""}
                    onChange={(e) => setSelectedSecao({...selectedSecao, descricao: e.target.value})}
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secao-botao">Texto do Botão</Label>
                  <Input
                    id="secao-botao"
                    value={selectedSecao.botao_texto}
                    onChange={(e) => setSelectedSecao({...selectedSecao, botao_texto: e.target.value})}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="secao-info-pagamento">Título da Informação de Pagamento</Label>
                  <Input
                    id="secao-info-pagamento"
                    value={selectedSecao.info_pagamento}
                    onChange={(e) => setSelectedSecao({...selectedSecao, info_pagamento: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secao-paragrafo1">Parágrafo Principal</Label>
                  <Textarea
                    id="secao-paragrafo1"
                    value={selectedSecao.paragrafo_principal}
                    onChange={(e) => setSelectedSecao({...selectedSecao, paragrafo_principal: e.target.value})}
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secao-paragrafo2">Parágrafo Secundário</Label>
                  <Textarea
                    id="secao-paragrafo2"
                    value={selectedSecao.paragrafo_secundario}
                    onChange={(e) => setSelectedSecao({...selectedSecao, paragrafo_secundario: e.target.value})}
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secao-valor-vista">Texto do Valor à Vista</Label>
                  <Input
                    id="secao-valor-vista"
                    value={selectedSecao.texto_valor_vista}
                    onChange={(e) => setSelectedSecao({...selectedSecao, texto_valor_vista: e.target.value})}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="secao-mostrar-contador"
                    checked={selectedSecao.mostrar_contador}
                    onCheckedChange={(checked) => 
                      setSelectedSecao({...selectedSecao, mostrar_contador: checked})
                    }
                  />
                  <Label htmlFor="secao-mostrar-contador">Mostrar Contador de Visitantes</Label>
                </div>
                
                {selectedSecao.mostrar_contador && (
                  <div className="space-y-2">
                    <Label htmlFor="secao-texto-contador">Texto do Contador</Label>
                    <Input
                      id="secao-texto-contador"
                      value={selectedSecao.texto_contador}
                      onChange={(e) => setSelectedSecao({...selectedSecao, texto_contador: e.target.value})}
                    />
                    <p className="text-sm text-gray-500">Use {'{count}'} para inserir o número de visitantes</p>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleUpdateSecao}
                    disabled={isSaving}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
