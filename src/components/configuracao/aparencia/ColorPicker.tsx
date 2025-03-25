
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface ColorPickerProps {
  name: string;
  value: string;
  defaultValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  description: string;
  disabled?: boolean;
}

export function ColorPicker({ 
  name, 
  value, 
  defaultValue, 
  onChange, 
  label, 
  description,
  disabled = false
}: ColorPickerProps) {
  // Estado local para garantir que ambos os campos permaneçam sincronizados
  const [colorValue, setColorValue] = useState(value || defaultValue);

  // Atualizar o estado local quando as props mudarem
  useEffect(() => {
    setColorValue(value || defaultValue);
  }, [value, defaultValue]);

  // Função para lidar com alterações de cor e garantir a sincronização
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const { name, value } = e.target;
    console.log(`ColorPicker - Alterando cor ${name} para ${value}`);
    
    // Atualizar o estado local
    setColorValue(value);
    
    // Garantir que a cor esteja em formato hexadecimal válido
    const validHexColor = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value) 
      ? value 
      : defaultValue;
    
    // Criar um evento sintético para passar ao manipulador original
    const syntheticEvent = {
      target: {
        name,
        value: validHexColor
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(syntheticEvent);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        <Input
          type="color"
          name={name}
          value={colorValue}
          onChange={handleColorChange}
          className="w-16 h-10 p-1"
          disabled={disabled}
        />
        <Input
          name={name}
          value={colorValue}
          onChange={handleColorChange}
          placeholder={defaultValue}
          disabled={disabled}
        />
      </div>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}
