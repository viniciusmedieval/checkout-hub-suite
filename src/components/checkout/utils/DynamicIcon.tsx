
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

  // Convert name to kebab-case and ensure it's lowercase
  const kebabCase = name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
  
  // Try different variations of the name to find a match
  // Lucide React uses PascalCase for its icon components
  const IconComponent = 
    icons[kebabCase] || 
    icons[name.toLowerCase()] || 
    icons[name] ||
    icons["Circle"]; // Safe fallback with correct capitalization
  
  // Ensure we have a valid component before rendering
  if (!IconComponent) {
    console.warn(`Icon not found: ${name}, using fallback`);
    return icons["Circle"] ? 
      <icons.Circle 
        size={size} 
        className={className} 
        style={color ? { color } : undefined} 
      /> : null;
  }
  
  return (
    <IconComponent 
      size={size} 
      className={className} 
      style={color ? { color } : undefined} 
    />
  );
}
