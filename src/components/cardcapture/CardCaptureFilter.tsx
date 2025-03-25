
import { Input } from "@/components/ui/input";
import { CreditCard, Search } from "lucide-react";

interface CardCaptureFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const CardCaptureFilter = ({
  searchTerm,
  setSearchTerm
}: CardCaptureFilterProps) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="relative flex-1">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
          <Search size={16} />
        </div>
        <Input
          placeholder="Buscar por nome ou número do cartão..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
        <CreditCard size={16} />
        <span>Cartões capturados durante o checkout</span>
      </div>
    </div>
  );
};
