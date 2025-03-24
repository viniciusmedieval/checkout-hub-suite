
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

interface ColorPickerProps {
  name: string;
  value: string;
  defaultValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  description: string;
  disabled?: boolean; // Added disabled as an optional prop
}

export function ColorPicker({ 
  name, 
  value, 
  defaultValue, 
  onChange, 
  label, 
  description,
  disabled = false // Default value is false
}: ColorPickerProps) {
  // Function to handle color changes and ensure both inputs (color picker and text field) stay in sync
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return; // Don't process changes if disabled
    
    const { name, value } = e.target;
    console.log(`ColorPicker - Alterando cor ${name} para ${value}`);
    
    // Garantir que a cor esteja em formato hexadecimal válido
    const validHexColor = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value) 
      ? value 
      : defaultValue;
    
    // Create a synthetic event to pass to the original handler
    const syntheticEvent = {
      target: {
        name,
        value: validHexColor
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(syntheticEvent);
  };

  // Ensure we have a valid value or use the default
  const colorValue = value || defaultValue;

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
