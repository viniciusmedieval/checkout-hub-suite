
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useConfiguracao } from "@/components/configuracao/useConfiguracao";
import { useState, useEffect } from "react";
import { ConfigCheckout } from "@/lib/types/database-types";

export function VisualConfiguracao() {
  const { config, handleConfigChange } = useConfiguracao();
  const [colorValues, setColorValues] = useState({
    cor_fundo: config.cor_fundo || "#FFFFFF",
    cor_titulo: config.cor_titulo || "#000000",
    cor_botao: config.cor_botao || "#8B5CF6",
    cor_texto_botao: config.cor_texto_botao || "#FFFFFF",
    cor_icones: config.cor_icones || "#8a898c"
  });

  // Atualiza estados locais quando as propriedades do config mudarem
  useEffect(() => {
    setColorValues({
      cor_fundo: config.cor_fundo || "#FFFFFF",
      cor_titulo: config.cor_titulo || "#000000",
      cor_botao: config.cor_botao || "#8B5CF6",
      cor_texto_botao: config.cor_texto_botao || "#FFFFFF",
      cor_icones: config.cor_icones || "#8a898c"
    });
  }, [config]);

  // Função para validar e formatar valores hex
  const isValidHex = (hex: string): boolean => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  };

  // Formatar para hex válido
  const formatHex = (hex: string): string => {
    let formatted = hex;
    
    // Adiciona # se não existir
    if (!formatted.startsWith("#")) {
      formatted = "#" + formatted;
    }
    
    // Converte 3 dígitos para 6 dígitos
    if (formatted.length === 4) {
      const r = formatted[1];
      const g = formatted[2];
      const b = formatted[3];
      formatted = `#${r}${r}${g}${g}${b}${b}`;
    }
    
    return formatted;
  };

  // Manipulador para alterações de cor
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Atualiza estado local
    setColorValues(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Cria evento sintético para enviar ao manipulador global
    const syntheticEvent = {
      target: {
        name,
        value
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleConfigChange(syntheticEvent);
  };

  // Componente ColorPicker reutilizável
  const ColorPicker = ({ 
    name, 
    value, 
    label, 
    description 
  }: { 
    name: keyof ConfigCheckout & string; 
    value: string; 
    label: string; 
    description: string;
  }) => {
    return (
      <div className="space-y-2">
        <Label htmlFor={name} className="text-sm font-medium">{label}</Label>
        <div className="grid grid-cols-[80px_1fr] gap-2">
          <div className="flex items-center justify-center p-1 border rounded-md">
            <Input
              id={`${name}-picker`}
              type="color"
              name={name}
              value={isValidHex(value) ? value : "#FFFFFF"}
              onChange={handleColorChange}
              className="w-full h-8 cursor-pointer p-0 border-0"
            />
          </div>
          <Input
            id={name}
            type="text"
            name={name}
            value={value}
            onChange={handleColorChange}
            placeholder="#FFFFFF"
            className="font-mono"
          />
        </div>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    );
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Configurações Visuais</CardTitle>
        <CardDescription>
          Personalize as cores e elementos visuais do checkout para corresponder à sua marca
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Seção de Cores Principais */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Cores Principais</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ColorPicker
              name="cor_fundo"
              value={colorValues.cor_fundo}
              label="Cor de Fundo"
              description="Define a cor de fundo de toda a página do checkout"
            />
            
            <ColorPicker
              name="cor_titulo"
              value={colorValues.cor_titulo}
              label="Cor dos Títulos"
              description="Define a cor do título principal e cabeçalhos"
            />
          </div>
        </div>

        <Separator className="my-6" />
        
        {/* Seção de Cores dos Botões */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Cores dos Botões</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ColorPicker
              name="cor_botao"
              value={colorValues.cor_botao}
              label="Cor do Botão de Compra"
              description="Define a cor do botão principal de compra e ações"
            />
            
            <ColorPicker
              name="cor_texto_botao"
              value={colorValues.cor_texto_botao}
              label="Cor do Texto do Botão"
              description="Define a cor do texto dentro do botão de compra"
            />
          </div>
        </div>

        <Separator className="my-6" />
        
        {/* Seção de Cores dos Ícones */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Cores dos Ícones</h3>
          
          <div className="max-w-md">
            <ColorPicker
              name="cor_icones"
              value={colorValues.cor_icones}
              label="Cor Global dos Ícones"
              description="Define a cor de todos os ícones no checkout"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
