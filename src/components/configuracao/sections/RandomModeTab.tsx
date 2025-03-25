
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { ConfigCheckout } from "@/lib/supabase";

interface RandomModeTabProps {
  config: ConfigCheckout;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

export function RandomModeTab({ config, handleSwitchChange }: RandomModeTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Modo Randômico</CardTitle>
        <CardDescription>
          Configure o modo randômico para testes de status de pagamento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="default">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Modo de teste</AlertTitle>
          <AlertDescription>
            O modo randômico gera status de pagamento aleatórios cada vez que um cliente finaliza uma compra.
            Útil para testar diferentes fluxos de status de pagamento sem precisar alterar a configuração manualmente.
          </AlertDescription>
        </Alert>
        
        <div className="flex items-center space-x-2 pt-4">
          <Switch
            id="modo-random"
            checked={config.modo_random === true}
            onCheckedChange={(checked) => handleSwitchChange('modo_random', checked)}
          />
          <Label htmlFor="modo-random">
            Ativar modo randômico
          </Label>
        </div>
        
        {config.modo_random && (
          <div className="mt-4 text-sm text-amber-700 bg-amber-50 p-3 rounded-md border border-amber-200">
            <p className="font-medium">⚠️ Modo randômico ativado</p>
            <p className="mt-1">
              Quando ativado, o sistema irá gerar aleatoriamente um status de pagamento (analisando, aprovado ou rejeitado) 
              cada vez que um cliente finalizar uma compra, ignorando a configuração padrão.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
