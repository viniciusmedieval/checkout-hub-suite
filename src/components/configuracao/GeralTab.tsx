
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ConfigCheckout } from "@/lib/supabase";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

interface GeralTabProps {
  config: ConfigCheckout;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

export function GeralTab({ config, handleConfigChange, handleSwitchChange }: GeralTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações Gerais</CardTitle>
        <CardDescription>
          Configure as principais informações do seu checkout
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Mensagem de Topo</label>
          <Input
            name="mensagem_topo"
            value={config.mensagem_topo}
            onChange={handleConfigChange}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Texto do Botão de Compra</label>
          <Input
            name="texto_botao"
            value={config.texto_botao}
            onChange={handleConfigChange}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Texto do Rodapé</label>
          <Input
            name="rodape_texto"
            value={config.rodape_texto}
            onChange={handleConfigChange}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome da Empresa</label>
            <Input
              name="rodape_empresa"
              value={config.rodape_empresa}
              onChange={handleConfigChange}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Ano do Rodapé</label>
            <Input
              name="rodape_ano"
              value={config.rodape_ano}
              onChange={handleConfigChange}
            />
          </div>
        </div>
        
        <Separator className="my-2" />
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Links do Rodapé</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">URL dos Termos de Uso</label>
            <Input
              name="url_termos_uso"
              value={config.url_termos_uso || ""}
              onChange={handleConfigChange}
              placeholder="https://seusite.com/termos"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">URL da Política de Privacidade</label>
            <Input
              name="url_politica_privacidade"
              value={config.url_politica_privacidade || ""}
              onChange={handleConfigChange}
              placeholder="https://seusite.com/privacidade"
            />
          </div>
        </div>
        
        <Separator className="my-2" />
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Mensagem de Destaque no Checkout</label>
          <Input
            name="mensagem_rodape"
            value={config.mensagem_rodape || ""}
            onChange={handleConfigChange}
            placeholder="Ex: Outras 47 pessoas estão finalizando agora"
          />
          <p className="text-xs text-gray-500 mt-1">
            Esta mensagem será exibida abaixo do botão de compra no checkout. Use-a para criar senso de urgência.
          </p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Mensagem de Termos de Compra</label>
          <Textarea
            name="mensagem_termos"
            value={config.mensagem_termos || ""}
            onChange={handleConfigChange}
            placeholder="Ex: Ao clicar em 'Comprar', você concorda com os Termos de Compra e está ciente da Política de Privacidade."
            className="min-h-[80px]"
          />
          <p className="text-xs text-gray-500 mt-1">
            Esta mensagem será exibida abaixo do botão de compra com links para seus termos e política de privacidade.
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            checked={config.mostrar_seguro} 
            onCheckedChange={(checked) => handleSwitchChange('mostrar_seguro', checked)}
            id="mostrar-seguro"
          />
          <Label htmlFor="mostrar-seguro">Mostrar ícone de segurança no rodapé</Label>
        </div>
      </CardContent>
    </Card>
  );
}
