
import { icons } from "lucide-react";

// Define props for the dynamic icon component
interface DynamicIconProps {
  name: string; // Icon name from Lucide icons
  size?: number;
  className?: string;
  color?: string;
}

export function DynamicIcon({ name, size = 16, className = "", color }: DynamicIconProps) {
  // Check if the icon name exists in the Lucide icons object
  // Lucide icon names are in kebab-case and lowercase
  
  // Convert name to kebab-case and ensure it's lowercase
  const normalizedName = name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
  
  // Look for the icon component in Lucide icons
  // First try the normalized name, then the original name, then fallback to "circle"
  // (using "circle" as fallback instead of "user" as it's simpler and always available)
  const IconComponent = 
    (icons[normalizedName] || icons[name.toLowerCase()] || icons["circle"]);
  
  // Render the icon with the specified props
  return IconComponent ? 
    <IconComponent 
      size={size} 
      className={className} 
      style={color ? { color } : undefined} 
    /> : null;
}
