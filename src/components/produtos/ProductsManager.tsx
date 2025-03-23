
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { addProductsToSupabase } from '@/lib/addProducts';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export function ProductsManager() {
  const [loading, setLoading] = useState(false);

  const handleAddProducts = async () => {
    setLoading(true);
    try {
      const result = await addProductsToSupabase();
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
        console.error('Error details:', result.error);
      }
    } catch (error) {
      console.error('Error adding products:', error);
      toast.error('Falha ao adicionar produtos. Verifique o console para mais detalhes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg bg-card">
      <h3 className="text-lg font-semibold">Gerenciamento de Produtos</h3>
      
      <div className="text-xs mb-2">
        <p className="text-green-600">
          Status: Conectado ao Supabase
        </p>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Adicione os produtos padrão ao banco de dados.
      </p>
      
      <Button 
        onClick={handleAddProducts} 
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adicionando...
          </>
        ) : 'Adicionar Produtos Padrão'}
      </Button>
    </div>
  );
}
