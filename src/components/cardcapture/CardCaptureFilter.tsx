
import { Input } from "@/components/ui/input";

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
        <Input
          placeholder="Buscar por nome ou número do cartão..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
        </div>
      </div>
    </div>
  );
};
