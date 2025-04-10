
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfigCheckout } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface RodapeTabProps {
  config: ConfigCheckout;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

export function RodapeTab({ config, handleConfigChange, handleSwitchChange }: RodapeTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rodapé</CardTitle>
        <CardDescription>
          Configure as informações do rodapé do checkout
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Footer Text */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Texto do Rodapé</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Texto Completo</label>
            <Input
              name="rodape_texto"
              value={config.rodape_texto || ""}
              onChange={handleConfigChange}
              placeholder="Ex: Todos os direitos reservados. Minha Empresa LTDA 2023"
            />
            <p className="text-xs text-gray-500">
              Ou configure individualmente abaixo:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome da Empresa</label>
              <Input
                name="rodape_empresa"
                value={config.rodape_empresa || ""}
                onChange={handleConfigChange}
                placeholder="Ex: Minha Empresa LTDA"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Ano</label>
              <Input
                name="rodape_ano"
                value={config.rodape_ano || ""}
                onChange={handleConfigChange}
                placeholder={new Date().getFullYear().toString()}
              />
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Mensagem de Segurança */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Mensagem de Segurança</h3>
          
          <div className="flex items-center space-x-2">
            <Switch 
              checked={Boolean(config.mostrar_seguro)}
              onCheckedChange={(checked) => handleSwitchChange('mostrar_seguro', checked)}
              id="mostrar-seguro"
            />
            <Label htmlFor="mostrar-seguro">Mostrar mensagem de segurança no rodapé</Label>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Texto da Mensagem de Segurança</label>
            <Input
              name="mensagem_rodape"
              value={config.mensagem_rodape || ""}
              onChange={handleConfigChange}
              placeholder="Ex: Compra 100% segura e garantida."
              disabled={!config.mostrar_seguro}
            />
          </div>
        </div>
        
        <Separator />
        
        {/* Links Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Links Legais</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">URL dos Termos de Uso</label>
            <Input
              name="url_termos_uso"
              value={config.url_termos_uso || ""}
              onChange={handleConfigChange}
              placeholder="https://seusite.com/termos"
            />
            <p className="text-xs text-gray-500">
              Link para seus termos de uso que serão exibidos no rodapé.
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">URL da Política de Privacidade</label>
            <Input
              name="url_politica_privacidade"
              value={config.url_politica_privacidade || ""}
              onChange={handleConfigChange}
              placeholder="https://seusite.com/privacidade"
            />
            <p className="text-xs text-gray-500">
              Link para sua política de privacidade que será exibida no rodapé.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
