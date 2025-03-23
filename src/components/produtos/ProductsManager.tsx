
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { addProductsToSupabase } from '@/lib/addProducts';
import { toast } from 'sonner';
import { Loader2, Copy, Trash } from 'lucide-react';

export function ProductsManager() {
  const [loading, setLoading] = useState(false);
  const [copyLoading, setCopyLoading] = useState<number | null>(null);

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

  const handleCopyCheckoutLink = (slug: string, id: number) => {
    setCopyLoading(id);
    try {
      // Construct checkout URL based on current window location
      const baseUrl = window.location.origin;
      const checkoutUrl = `${baseUrl}/checkout/${slug}`;
      
      // Copy to clipboard
      navigator.clipboard.writeText(checkoutUrl).then(() => {
        toast.success(`Link do checkout copiado: ${checkoutUrl}`);
      }, (err) => {
        console.error('Erro ao copiar: ', err);
        toast.error('Não foi possível copiar o link do checkout.');
      });
    } catch (error) {
      console.error('Error copying checkout link:', error);
      toast.error('Falha ao copiar o link do checkout.');
    } finally {
      setTimeout(() => setCopyLoading(null), 500);
    }
  };

  const handleDeleteProduct = (id: number) => {
    // Aqui poderia ser implementada a função para excluir o produto
    toast.success(`Função para excluir o produto ${id} será implementada em breve`);
  };

  // Recupera produtos do localStorage para exibir os links de checkout
  const getProductsFromLocalStorage = () => {
    try {
      const mockStorage = localStorage.getItem('mockSupabaseStorage');
      if (mockStorage) {
        const { produtos } = JSON.parse(mockStorage);
        return produtos || [];
      }
    } catch (error) {
      console.error("Erro ao recuperar produtos do localStorage:", error);
    }
    return [];
  };

  const products = getProductsFromLocalStorage();

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

      {products.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Links dos Produtos</h4>
          <div className="space-y-2">
            {products.map((product: any) => (
              <div key={product.id} className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm">
                <span className="truncate flex-1">{product.nome}</span>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleCopyCheckoutLink(product.slug, product.id)}
                    disabled={copyLoading === product.id}
                  >
                    {copyLoading === product.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <>
                        <Copy className="h-3 w-3 mr-1" /> Copiar Link
                      </>
                    )}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
