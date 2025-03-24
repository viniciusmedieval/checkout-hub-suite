
import { icons } from "lucide-react";

// Define props for the dynamic icon component
interface DynamicIconProps {
  name: string; // Icon name from Lucide icons
  size?: number;
  className?: string;
  color?: string;
}

export function DynamicIcon({ name, size = 16, className = "", color }: DynamicIconProps) {
  // Get the icon component from Lucide icons
  // Default to "user" if the requested icon doesn't exist
  const IconComponent = icons[name as keyof typeof icons] || icons["user"];
  
  // Render the icon with the specified props
  return <IconComponent size={size} className={className} style={color ? { color } : undefined} />;
}
