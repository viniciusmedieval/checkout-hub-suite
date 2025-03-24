
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
  // Lucide icon names are in kebab-case, but might be passed in camelCase or with spaces
  
  // Convert name to kebab-case if it's not already
  const normalizedName = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  
  // Get the icon component from Lucide icons
  const IconComponent = icons[normalizedName as keyof typeof icons] || 
                        icons[name as keyof typeof icons] || 
                        icons["user"]; // Default to "user" if the requested icon doesn't exist
  
  // Render the icon with the specified props
  return <IconComponent size={size} className={className} style={color ? { color } : undefined} />;
}
