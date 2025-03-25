
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfigCheckout } from "@/lib/types/database-types";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";

interface InstallmentsTabProps {
  config: ConfigCheckout;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InstallmentsTab({ config, handleConfigChange }: InstallmentsTabProps) {
  const [maxInstallments, setMaxInstallments] = useState(config.max_installments || 12);

  useEffect(() => {
    // Update the slider when the config changes
    setMaxInstallments(config.max_installments || 12);
  }, [config.max_installments]);

  const handleSliderChange = (value: number[]) => {
    const newValue = value[0];
    setMaxInstallments(newValue);
    
    // Create a synthetic event to update the config
    const event = {
      target: {
        name: "max_installments",
        value: newValue.toString(),
        type: "range"
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleConfigChange(event);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração de Parcelamento</CardTitle>
        <CardDescription>
          Configure o número máximo de parcelas disponíveis para pagamentos com cartão
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="max-installments" className="text-base font-medium">
              Número máximo de parcelas: {maxInstallments}
            </Label>
            <div className="pt-4">
              <Slider
                id="max-installments"
                min={1}
                max={12}
                step={1}
                value={[maxInstallments]}
                onValueChange={handleSliderChange}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>1x</span>
              <span>6x</span>
              <span>12x</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <p className="text-sm text-blue-700">
            Esta configuração define o número máximo de parcelas que os clientes poderão selecionar durante o checkout.
            Recomendamos limitar o número de parcelas conforme sua política de vendas e os custos de processamento do cartão.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
