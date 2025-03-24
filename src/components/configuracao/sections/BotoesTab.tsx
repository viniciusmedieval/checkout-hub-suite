import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ConfigCheckout } from "@/lib/supabase";

interface BotoesTabProps {
  config: ConfigCheckout;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

export function BotoesTab({ config, handleConfigChange, handleSwitchChange }: BotoesTabProps) {
  // Para debugging
  console.log("BotoesTab - config.mostrar_contador:", config.mostrar_contador);
  console.log("BotoesTab - config:", config);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Botões e Compra</CardTitle>
          <CardDescription>
            Personalize a aparência dos botões de compra do seu checkout
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Texto do Botão de Compra</label>
            <Input
              name="texto_botao"
              value={config.texto_botao}
              onChange={handleConfigChange}
              placeholder="Ex: GARANTIR AGORA"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cor do Botão</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  name="cor_botao"
                  value={config.cor_botao}
                  onChange={handleConfigChange}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <Input
                  name="cor_botao"
                  value={config.cor_botao}
                  onChange={handleConfigChange}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Cor do Texto do Botão</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  name="cor_texto_botao"
                  value={config.cor_texto_botao}
                  onChange={handleConfigChange}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <Input
                  name="cor_texto_botao"
                  value={config.cor_texto_botao}
                  onChange={handleConfigChange}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          {/* Contador de Visitantes */}
          <div className="space-y-4">
            <h3 className="text-md font-medium">Contador de Visitantes</h3>
            <div className="flex items-center space-x-2">
              <Switch 
                checked={config.mostrar_contador === true} 
                onCheckedChange={(checked) => handleSwitchChange('mostrar_contador', checked)}
                id="mostrar-contador"
              />
              <Label htmlFor="mostrar-contador">Exibir contador de visitantes</Label>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Texto do Contador</label>
              <Input
                name="texto_contador"
                value={config.texto_contador || "{count} pessoas estão vendo este produto agora"}
                onChange={handleConfigChange}
                placeholder="Ex: {count} pessoas estão vendo este produto"
                disabled={config.mostrar_contador !== true}
              />
              <p className="text-xs text-gray-500">
                Use {"{count}"} para inserir o número de visitantes no texto.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Mínimo de Visitantes</label>
                <Input
                  type="number"
                  name="contador_min"
                  value={config.contador_min || 50}
                  onChange={handleConfigChange}
                  min="1"
                  disabled={config.mostrar_contador !== true}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Máximo de Visitantes</label>
                <Input
                  type="number"
                  name="contador_max"
                  value={config.contador_max || 200}
                  onChange={handleConfigChange}
                  min="1"
                  disabled={config.mostrar_contador !== true}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
