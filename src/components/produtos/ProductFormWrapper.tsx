
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ProductForm } from "@/components/produtos/ProductForm";
import { Produto } from "@/lib/supabase";

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
  return (
    <>
      {isMobile ? (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="bottom" className="h-[90%] max-h-[90%] p-6 overflow-y-auto">
            {isOpen && (
              <ProductForm 
                product={product} 
                onClose={onClose} 
                onSuccess={onSuccess} 
              />
            )}
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto p-6">
            {isOpen && (
              <ProductForm 
                product={product} 
                onClose={onClose} 
                onSuccess={onSuccess} 
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
