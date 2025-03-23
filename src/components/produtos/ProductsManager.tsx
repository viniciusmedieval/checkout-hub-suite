
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { addProductsToSupabase } from '@/lib/addProducts';
import { toast } from 'sonner';
import { Loader2, Link, Copy, Trash } from 'lucide-react';

export function ProductsManager() {
  const [loading, setLoading] = useState(false);

  const handleAddProducts = async () => {
    setLoading(true);
    try {
      const result = await addProductsToSupabase();
      
      if (result.success) {
        toast.success(result.message);
        // Refresh the page to show the updated data
        window.location.reload();
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

  const copyCheckoutLink = (slug: string) => {
    const url = `${window.location.origin}/checkout/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link de checkout copiado!");
  };

  const deleteProduct = (id: string) => {
    toast.info("Função de exclusão será implementada em breve.");
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
        Adicione os produtos padrão ao banco de dados. Estes produtos ficarão permanentemente salvos no Supabase e localStorage.
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

      <div className="text-sm mt-2">
        <p className="text-muted-foreground mb-2">Ações rápidas:</p>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => copyCheckoutLink('curso-marketing-digital')}
            className="flex items-center gap-1"
          >
            <Copy size={14} />
            Copiar link Curso
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => copyCheckoutLink('ebook-vendas-online')}
            className="flex items-center gap-1"
          >
            <Copy size={14} />
            Copiar link Ebook
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => copyCheckoutLink('mentoria-negocios')}
            className="flex items-center gap-1"
          >
            <Copy size={14} />
            Copiar link Mentoria
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => deleteProduct('1')}
            className="flex items-center gap-1"
          >
            <Trash size={14} />
            Excluir produtos
          </Button>
        </div>
      </div>
    </div>
  );
}
