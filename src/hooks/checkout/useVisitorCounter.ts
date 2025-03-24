import { useState, useEffect } from "react";
import { ConfigCheckout } from "@/lib/supabase";

export function useVisitorCounter(configCheckout?: ConfigCheckout | null) {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    // Only run this if the visitor counter is enabled in the config
    if (configCheckout?.mostrar_contador) {
      // Get min and max from config or use defaults
      const min = configCheckout.contador_min || 50;
      const max = configCheckout.contador_max || 200;
      
      // Generate a random number within the range
      const randomCount = Math.floor(Math.random() * (max - min + 1)) + min;
      setVisitorCount(randomCount);
      
      // Set up an interval to periodically update the count for a dynamic feel
      const interval = setInterval(() => {
        // Small random adjustment (+/- 5)
        const adjustment = Math.floor(Math.random() * 11) - 5;
        
        setVisitorCount((prevCount) => {
          const newCount = prevCount + adjustment;
          // Keep within min-max bounds
          if (newCount < min) return min;
          if (newCount > max) return max;
          return newCount;
        });
      }, 30000); // Update every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [configCheckout]);

  return { visitorCount };
}
