
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { addProductsToSupabase } from '@/lib/addProducts';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { SupabaseConnector } from './SupabaseConnector';
import { createClient } from '@supabase/supabase-js';

export function ProductsManager() {
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Verificar se já temos credenciais salvas
  useEffect(() => {
    const supabaseUrl = localStorage.getItem('supabaseUrl');
    const supabaseKey = localStorage.getItem('supabaseKey');
    
    if (supabaseUrl && supabaseKey) {
      try {
        // Testa se é possível criar um cliente
        createClient(supabaseUrl, supabaseKey);
        setIsConnected(true);
      } catch (error) {
        console.error('Erro ao conectar ao Supabase:', error);
        setIsConnected(false);
      }
    }
  }, []);

  const handleConnect = async ({ supabaseUrl, supabaseKey }: { supabaseUrl: string, supabaseKey: string }) => {
    try {
      // Testa se é possível criar um cliente
      createClient(supabaseUrl, supabaseKey);
      setIsConnected(true);
      
      // Aqui poderia fazer um teste de conexão mais completo
      // Por exemplo, tentar fazer uma query simples
    } catch (error) {
      console.error('Erro ao conectar ao Supabase:', error);
      toast.error('Falha ao conectar ao Supabase. Verifique suas credenciais.');
      setIsConnected(false);
    }
  };

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
      
      <SupabaseConnector 
        onConnect={handleConnect}
        isConnected={isConnected}
      />
      
      <p className="text-sm text-muted-foreground">
        Adicione os produtos padrão ao banco de dados.
      </p>
      
      <div className="text-xs mb-2">
        <p className={isConnected ? "text-green-600" : "text-amber-600"}>
          Status: {isConnected ? "Conectado ao Supabase" : "Usando mock de banco de dados"}
        </p>
      </div>
      
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
