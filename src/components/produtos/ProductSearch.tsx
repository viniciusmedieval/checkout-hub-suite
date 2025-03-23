
import { Database } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProductSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onReload: () => void;
  // Add the following props to match what's passed from ProductsManager
  search?: string;
  setSearch?: (value: string) => void;
}

export function ProductSearch({ 
  searchTerm, 
  onSearchChange, 
  onReload,
  search,
  setSearch
}: ProductSearchProps) {
  // Use either the new props or the original ones
  const searchValue = search !== undefined ? search : searchTerm;
  const handleSearchChange = setSearch || onSearchChange;

  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="relative flex-1">
        <Input
          placeholder="Buscar produto..."
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
        </div>
      </div>
      <Button variant="outline" onClick={onReload}>
        <Database className="h-4 w-4 mr-2" />
        Recarregar
      </Button>
    </div>
  );
}
