
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Database, ExternalLink, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { supabase, reinitializeSupabaseClient, isSupabaseInitialized } from "@/lib/supabase";

interface SupabaseCredentials {
  supabaseUrl: string;
  supabaseKey: string;
}

interface SupabaseConnectorProps {
  onConnect: (credentials: SupabaseCredentials) => void;
  isConnected: boolean;
}

export function SupabaseConnector({ onConnect, isConnected }: SupabaseConnectorProps) {
  // Valores padrão para facilitar a conexão
  const defaultUrl = 'https://wqijkkbxqkpbjbqehlqw.supabase.co';
  const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxaWpra2J4cWtwYmpicWVobHF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2ODcwNDYsImV4cCI6MjA1ODI2MzA0Nn0.IerDihb1CqSIVqootaphhkBUG4maAhLiVkqapvGWLhU';

  const [supabaseUrl, setSupabaseUrl] = useState<string>(() => 
    localStorage.getItem('supabaseUrl') || defaultUrl
  );
  const [supabaseKey, setSupabaseKey] = useState<string>(() => 
    localStorage.getItem('supabaseKey') || defaultKey
  );
  const [showForm, setShowForm] = useState<boolean>(!isConnected);
  const [connecting, setConnecting] = useState<boolean>(false);

  useEffect(() => {
    // Preencher com valores padrão se estiverem vazios
    if (!supabaseUrl) {
      setSupabaseUrl(defaultUrl);
    }
    if (!supabaseKey) {
      setSupabaseKey(defaultKey);
    }

    // Verificar conexão atual
    const checkConnection = async () => {
      if (isSupabaseInitialized()) {
        try {
          // Tentar uma consulta simples para verificar a conexão
          const { error } = await supabase.from('produtos').select('id').limit(1);
          
          if (!error) {
            console.log("SupabaseConnector - Conexão verificada com sucesso");
            onConnect({ supabaseUrl, supabaseKey });
          } else {
            console.warn("SupabaseConnector - Erro ao verificar conexão:", error);
            setShowForm(true);
          }
        } catch (err) {
          console.error("SupabaseConnector - Erro ao testar conexão:", err);
          setShowForm(true);
        }
      } else {
        console.warn("SupabaseConnector - Cliente Supabase não inicializado");
        setShowForm(true);
      }
    };

    checkConnection();
  }, [supabaseUrl, supabaseKey, isConnected, onConnect]);

  const handleConnect = async () => {
    if (!supabaseUrl || !supabaseKey) {
      toast.error("Preencha todos os campos");
      return;
    }

    setConnecting(true);
    try {
      // Salvar no localStorage
      localStorage.setItem('supabaseUrl', supabaseUrl);
      localStorage.setItem('supabaseKey', supabaseKey);
      
      // Reinicializar o cliente
      const newClient = reinitializeSupabaseClient(supabaseUrl, supabaseKey);
      
      if (!newClient) {
        throw new Error("Falha ao criar novo cliente Supabase");
      }
      
      // Testar a conexão
      const { error } = await newClient.from('produtos').select('id').limit(1);
      if (error) {
        throw new Error(`Erro ao testar conexão: ${error.message}`);
      }
      
      // Notificar o componente pai
      onConnect({ supabaseUrl, supabaseKey });
      setShowForm(false);
      toast.success("Conectado ao Supabase com sucesso!");
      
      // Recarregar a página para aplicar as novas credenciais em todo o aplicativo
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Erro ao conectar ao Supabase:", error);
      toast.error(`Erro ao conectar: ${error.message || "Verifique as credenciais"}`);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('supabaseUrl');
    localStorage.removeItem('supabaseKey');
    setSupabaseUrl('');
    setSupabaseKey('');
    setShowForm(true);
    toast.info("Desconectado do Supabase");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleUseDefaultCredentials = async () => {
    setSupabaseUrl(defaultUrl);
    setSupabaseKey(defaultKey);
    
    // Salvar no localStorage
    localStorage.setItem('supabaseUrl', defaultUrl);
    localStorage.setItem('supabaseKey', defaultKey);
    
    // Reinicializar o cliente
    setConnecting(true);
    try {
      const newClient = reinitializeSupabaseClient(defaultUrl, defaultKey);
      
      if (!newClient) {
        throw new Error("Falha ao criar cliente com credenciais padrão");
      }
      
      // Notificar o componente pai
      onConnect({ supabaseUrl: defaultUrl, supabaseKey: defaultKey });
      setShowForm(false);
      toast.success("Credenciais padrão aplicadas! Conectado ao Supabase.");
      
      // Recarregar a página para aplicar as novas credenciais
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Erro ao usar credenciais padrão:", error);
      toast.error(`Erro ao conectar: ${error.message || "Verifique as credenciais"}`);
    } finally {
      setConnecting(false);
    }
  };

  if (!showForm && isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-green-500" />
            Conectado ao Supabase
          </CardTitle>
          <CardDescription>
            Seu aplicativo está conectado ao banco de dados Supabase
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <div className="flex justify-between w-full">
            <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
              Ver configurações
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDisconnect}>
              Desconectar
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Configurar conexão Supabase
        </CardTitle>
        <CardDescription>
          Configure as credenciais para conectar ao banco de dados Supabase
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="ml-2">
            Suas credenciais são armazenadas apenas no seu navegador (localStorage)
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="supabaseUrl">URL do Supabase</Label>
          <Input 
            id="supabaseUrl" 
            placeholder="https://xyzproject.supabase.co" 
            value={supabaseUrl}
            onChange={(e) => setSupabaseUrl(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Encontre sua URL em: Configurações do Projeto &gt; API
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="supabaseKey">Chave Anônima (anon key)</Label>
          <Input 
            id="supabaseKey" 
            type="password"
            placeholder="eyJhbGciOiJIUzI1NiIsInR..." 
            value={supabaseKey}
            onChange={(e) => setSupabaseKey(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Encontre sua chave anônima em: Configurações do Projeto &gt; API &gt; Project API keys
          </p>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full flex items-center gap-2 mt-2"
          onClick={handleUseDefaultCredentials}
          disabled={connecting}
        >
          <RefreshCw className={`h-4 w-4 ${connecting ? 'animate-spin' : ''}`} />
          Usar credenciais padrão
        </Button>

        <div className="mt-2">
          <a 
            href="https://supabase.com/dashboard/projects" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm flex items-center gap-1 text-primary hover:underline"
          >
            Acessar Supabase Dashboard <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleConnect} 
          className="w-full"
          disabled={connecting}
        >
          {connecting ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Conectando...
            </>
          ) : (
            "Conectar ao Supabase"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
