
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfigCheckout } from "@/lib/supabase";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FormularioTabProps {
  config: ConfigCheckout;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

export function FormularioTab({ config, handleConfigChange, handleSwitchChange }: FormularioTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Formulário de Dados</CardTitle>
        <CardDescription>
          Configure os campos e opções de formulário no checkout
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Form Fields Configuration */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Campos do Formulário</h3>
          
          <div className="flex items-center space-x-2 mb-4">
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

        {/* Phone Field Configuration */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Opções do Campo de Telefone</h3>
          
          <div className="flex items-center space-x-2 mb-4">
            <Switch 
              checked={config.mostrar_bandeira_brasil || false} 
              onCheckedChange={(checked) => handleSwitchChange('mostrar_bandeira_brasil', checked)}
              id="mostrar-bandeira-brasil"
            />
            <Label htmlFor="mostrar-bandeira-brasil">Mostrar bandeira do Brasil</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              checked={config.mostrar_prefixo_telefone || false} 
              onCheckedChange={(checked) => handleSwitchChange('mostrar_prefixo_telefone', checked)}
              id="mostrar-prefixo-telefone"
            />
            <Label htmlFor="mostrar-prefixo-telefone">Mostrar prefixo "+55"</Label>
          </div>
        </div>
        
        <Separator />
        
        {/* Title texts */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Títulos das Seções</h3>
          
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
