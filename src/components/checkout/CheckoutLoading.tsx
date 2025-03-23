
import { Loader2 } from "lucide-react";

export function CheckoutLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
      <p className="text-gray-800">Carregando produto...</p>
    </div>
  );
}
