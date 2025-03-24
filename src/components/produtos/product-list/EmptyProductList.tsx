
import { PackageIcon } from "lucide-react";

interface EmptyProductListProps {
  searchTerm: string;
}

export function EmptyProductList({ searchTerm }: EmptyProductListProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 mt-4 text-center border rounded-lg">
      <PackageIcon className="w-12 h-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium">Nenhum produto encontrado</h3>
      <p className="text-sm text-gray-500 mt-2">
        {searchTerm ? 'Tente ajustar os critérios de busca.' : 'Adicione produtos para começar.'}
      </p>
    </div>
  );
}
