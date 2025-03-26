
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
  const [colorValue, setColorValue] = useState(value || defaultValue);

  // Update local state when props change
  useEffect(() => {
    setColorValue(value || defaultValue);
  }, [value, defaultValue]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const { name: fieldName, value: newValue } = e.target;
    console.log(`ColorPicker - Changing color ${fieldName} to ${newValue}`);
    
    // Update local state
    setColorValue(newValue);
    
    // Create synthetic event to pass to the original handler
    const syntheticEvent = {
      target: {
        name: fieldName,
        value: newValue
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
          className="w-16 h-10 p-1 cursor-pointer"
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
