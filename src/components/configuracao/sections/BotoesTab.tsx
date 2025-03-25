
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ConfigCheckout } from "@/lib/supabase";
import { ColorPicker } from "@/components/configuracao/aparencia/ColorPicker";
import { Textarea } from "@/components/ui/textarea";

interface BotoesTabProps {
  config: ConfigCheckout;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

export function BotoesTab({ config, handleConfigChange, handleSwitchChange }: BotoesTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Botão de Compra e Contador</CardTitle>
        <CardDescription>
          Configure o botão de compra e contador de visitantes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* PIX Button text */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Texto do Botão PIX</label>
          <Input
            name="texto_botao"
            value={config.texto_botao}
            onChange={handleConfigChange}
            placeholder="Ex: GARANTIR AGORA"
          />
          <p className="text-xs text-gray-500">
            Este texto será exibido no botão principal de finalização da compra via PIX.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ColorPicker
            name="cor_botao"
            value={config.cor_botao || "#8B5CF6"}
            defaultValue="#8B5CF6"
            onChange={handleConfigChange}
            label="Cor do Botão PIX"
            description="Define a cor do botão de pagamento PIX"
          />
          
          <ColorPicker
            name="cor_texto_botao"
            value={config.cor_texto_botao || "#FFFFFF"}
            defaultValue="#FFFFFF"
            onChange={handleConfigChange}
            label="Cor do Texto do Botão PIX"
            description="Define a cor do texto do botão de pagamento PIX"
          />
        </div>
        
        <Separator className="my-4" />
        
        {/* Card Button text */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Texto do Botão de Cartão</label>
          <Input
            name="texto_botao_card"
            value={config.texto_botao_card || "Pagar com Cartão"}
            onChange={handleConfigChange}
            placeholder="Ex: PAGAR COM CARTÃO"
          />
          <p className="text-xs text-gray-500">
            Este texto será exibido no botão de pagamento com cartão.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ColorPicker
            name="cor_botao_card"
            value={config.cor_botao_card || config.cor_botao || "#8B5CF6"}
            defaultValue="#8B5CF6"
            onChange={handleConfigChange}
            label="Cor do Botão Cartão"
            description="Define a cor do botão de pagamento com cartão"
          />
          
          <ColorPicker
            name="cor_texto_botao_card"
            value={config.cor_texto_botao_card || config.cor_texto_botao || "#FFFFFF"}
            defaultValue="#FFFFFF"
            onChange={handleConfigChange}
            label="Cor do Texto do Botão Cartão"
            description="Define a cor do texto do botão de pagamento com cartão"
          />
        </div>
        
        <Separator className="my-4" />
        
        {/* Visitor Counter */}
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
          
          <ColorPicker
            name="cor_texto_contador"
            value={config.cor_texto_contador || "#4B5563"}
            defaultValue="#4B5563"
            onChange={handleConfigChange}
            label="Cor do Texto do Contador"
            description="Cor do texto da mensagem de contador de visitantes"
            disabled={config.mostrar_contador !== true}
          />
          
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

        <Separator className="my-4" />
        
        {/* Security messages */}
        <div className="space-y-4">
          <h3 className="text-md font-medium">Mensagens de Segurança</h3>

          <div className="space-y-2">
            <label className="text-sm font-medium">Mensagem de Destaque no Checkout</label>
            <Input
              name="mensagem_rodape"
              value={config.mensagem_rodape || ""}
              onChange={handleConfigChange}
              placeholder="Ex: Compra 100% segura e garantida"
            />
            <p className="text-xs text-gray-500">
              Esta mensagem será exibida abaixo do botão de compra.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Mensagem de Termos de Compra</label>
            <Textarea
              name="mensagem_termos"
              value={config.mensagem_termos || ""}
              onChange={handleConfigChange}
              placeholder="Ex: Ao clicar em 'Comprar', você concorda com os Termos de Compra"
              className="min-h-[80px]"
            />
            <p className="text-xs text-gray-500">
              Esta mensagem será exibida abaixo do botão de compra com links para seus termos.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              checked={config.mostrar_seguro === true} 
              onCheckedChange={(checked) => handleSwitchChange('mostrar_seguro', checked)}
              id="mostrar-seguro-botao"
            />
            <Label htmlFor="mostrar-seguro-botao">Mostrar ícone de segurança no rodapé</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
