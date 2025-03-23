
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductFilterProps {
  filter: string;
  setFilter: (value: string) => void;
}

export function ProductFilter({ filter, setFilter }: ProductFilterProps) {
  return (
    <Select value={filter} onValueChange={setFilter}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filtrar por status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="todos">Todos</SelectItem>
        <SelectItem value="ativos">Ativos</SelectItem>
        <SelectItem value="inativos">Inativos</SelectItem>
      </SelectContent>
    </Select>
  );
}
