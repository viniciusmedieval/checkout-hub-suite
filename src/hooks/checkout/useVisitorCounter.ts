
import { useState, useEffect } from "react";
import { ConfigCheckout } from "@/lib/supabase";

export const useVisitorCounter = (configCheckout: ConfigCheckout | null) => {
  // Default visitor count range if config values aren't available
  const defaultMinVisitors = 50;
  const defaultMaxVisitors = 200;
  
  // Initialize visitor count with a random value between min and max
  const [visitorCount, setVisitorCount] = useState(
    Math.floor(Math.random() * (defaultMaxVisitors - defaultMinVisitors + 1)) + defaultMinVisitors
  );

  useEffect(() => {
    if (configCheckout) {
      console.log("useVisitorCounter - configCheckout:", configCheckout);
      console.log("useVisitorCounter - mostrar_contador:", configCheckout.mostrar_contador);
      console.log("useVisitorCounter - contador min/max:", configCheckout.contador_min, configCheckout.contador_max);
      
      // Use config values if available, otherwise fallback to defaults
      const min = typeof configCheckout.contador_min === 'number' ? configCheckout.contador_min : defaultMinVisitors;
      const max = typeof configCheckout.contador_max === 'number' ? configCheckout.contador_max : defaultMaxVisitors;
      
      console.log("useVisitorCounter - Valores finais min/max:", min, max);
      
      // Update the visitor count with the correct range from config
      setVisitorCount(Math.floor(Math.random() * (max - min + 1)) + min);
    }
  }, [configCheckout]);

  return {
    visitorCount
  };
};
