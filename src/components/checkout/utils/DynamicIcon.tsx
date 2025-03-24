
import { icons } from "lucide-react";

// Define props for the dynamic icon component
interface DynamicIconProps {
  name: string; // Icon name from Lucide icons
  size?: number;
  className?: string;
  color?: string;
}

export function DynamicIcon({ name, size = 16, className = "", color }: DynamicIconProps) {
  if (!name) {
    console.warn("No icon name provided to DynamicIcon component");
    return null;
  }

  // Convert kebab-case to PascalCase for Lucide
  const pascalCase = name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
  
  // Try different variations of the name to find a match
  // Lucide icon names are in PascalCase in the icons object
  const LucideIcon = 
    icons[pascalCase] || 
    icons[name] || 
    icons[name.charAt(0).toUpperCase() + name.slice(1)] || 
    icons["Circle"]; // Safe fallback with correct capitalization
  
  if (!LucideIcon) {
    console.warn(`Icon not found: ${name}, using Circle fallback`);
    return null;
  }
  
  return (
    <LucideIcon 
      size={size} 
      className={className} 
      color={color}
    />
  );
}
