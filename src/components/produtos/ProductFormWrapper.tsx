
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ProductForm } from "@/components/produtos/ProductForm";
import { Produto } from "@/lib/supabase";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader } from "lucide-react";

interface ProductFormWrapperProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  product?: Produto;
  onClose: () => void;
  onSuccess: () => void;
  isMobile: boolean;
}

export function ProductFormWrapper({ 
  isOpen, 
  setIsOpen, 
  product, 
  onClose, 
  onSuccess, 
  isMobile 
}: ProductFormWrapperProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset states when the modal is opened/closed
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError(null);
      
      // Simulate loading product data (replace with actual data fetching if needed)
      const timer = setTimeout(() => {
        setIsLoading(false);
        // If product exists but has a problem, we could set an error
        if (product && product.id < 0) {
          setError("Não foi possível carregar o produto. Tente novamente.");
          toast.error("Erro ao carregar produto");
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, product]);

  const handleClose = () => {
    onClose();
    // Reset states when closing
    setError(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }
    
    if (error) {
      return <ErrorState error={error} onRetry={() => setIsLoading(false)} />;
    }
    
    return (
      <ProductForm 
        product={product} 
        onClose={handleClose} 
        onSuccess={onSuccess} 
      />
    );
  };

  return (
    <>
      {isMobile ? (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="bottom" className="h-[90%] max-h-[90%] p-6 overflow-y-auto">
            {isOpen && renderContent()}
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto p-6">
            {isOpen && renderContent()}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center pb-4 border-b mb-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b mb-4">
        <h2 className="text-lg font-semibold text-destructive">Erro</h2>
      </div>
      
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="ml-2">
          {error}
        </AlertDescription>
      </Alert>
      
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <button 
          onClick={onRetry}
          className="flex items-center gap-2 text-primary hover:underline"
        >
          <Loader className="h-4 w-4" />
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
