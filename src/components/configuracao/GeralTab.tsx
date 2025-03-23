
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ConfigCheckout } from "@/lib/supabase";

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
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Mensagem de Segurança</label>
          <Input
            name="mensagem_rodape"
            value={config.mensagem_rodape}
            onChange={handleConfigChange}
          />
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
