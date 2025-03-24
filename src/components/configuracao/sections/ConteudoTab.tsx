
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfigCheckout } from "@/lib/supabase";
import { ColorPicker } from "../aparencia/ColorPicker";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ConteudoTabProps {
  config: ConfigCheckout;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

export function ConteudoTab({ config, handleConfigChange, handleSwitchChange }: ConteudoTabProps) {
  // Function to handle color changes and ensure both inputs stay in sync
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleConfigChange(e);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campos e Conteúdo</CardTitle>
        <CardDescription>
          Configure as cores e estilos do conteúdo principal do checkout
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Background Color */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Cores de Fundo e Texto</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorPicker
              name="cor_fundo"
              value={config.cor_fundo}
              defaultValue="#FFFFFF"
              onChange={handleColorChange}
              label="Cor de Fundo da Página"
              description="Define a cor de fundo do checkout"
            />
            
            <ColorPicker
              name="cor_titulo"
              value={config.cor_titulo}
              defaultValue="#000000"
              onChange={handleColorChange}
              label="Cor dos Títulos"
              description="Define a cor dos títulos no checkout"
            />
          </div>
        </div>

        <Separator />

        {/* Form Fields Configuration */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Configuração de Campos</h3>
          
          <div className="flex items-center space-x-2 mb-2">
            <Switch 
              checked={config.mostrar_campo_documento || false} 
              onCheckedChange={(checked) => handleSwitchChange('mostrar_campo_documento', checked)}
              id="mostrar-campo-documento"
            />
            <Label htmlFor="mostrar-campo-documento">Mostrar campo de documento (CPF/CNPJ)</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              checked={config.mostrar_campo_telefone || false} 
              onCheckedChange={(checked) => handleSwitchChange('mostrar_campo_telefone', checked)}
              id="mostrar-campo-telefone"
            />
            <Label htmlFor="mostrar-campo-telefone">Mostrar campo de telefone</Label>
          </div>
        </div>
        
        <Separator />
        
        {/* Content Text Configuration */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Textos do Checkout</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Título da Seção de Identificação</label>
            <Input
              name="titulo_identificacao"
              value={config.titulo_identificacao || "Identificação"}
              onChange={handleConfigChange}
              placeholder="Ex: Seus Dados"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Título da Seção de Pagamento</label>
            <Input
              name="titulo_pagamento"
              value={config.titulo_pagamento || "Pagamento"}
              onChange={handleConfigChange}
              placeholder="Ex: Formas de Pagamento"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
