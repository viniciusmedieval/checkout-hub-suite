
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Database, ExternalLink, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface SupabaseCredentials {
  supabaseUrl: string;
  supabaseKey: string;
}

interface SupabaseConnectorProps {
  onConnect: (credentials: SupabaseCredentials) => void;
  isConnected: boolean;
}

export function SupabaseConnector({ onConnect, isConnected }: SupabaseConnectorProps) {
  const [supabaseUrl, setSupabaseUrl] = useState<string>(() => 
    localStorage.getItem('supabaseUrl') || 'https://wqijkkbxqkpbjbqehlqw.supabase.co'
  );
  const [supabaseKey, setSupabaseKey] = useState<string>(() => 
    localStorage.getItem('supabaseKey') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxaWpra2J4cWtwYmpicWVobHF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2ODcwNDYsImV4cCI6MjA1ODI2MzA0Nn0.IerDihb1CqSIVqootaphhkBUG4maAhLiVkqapvGWLhU'
  );
  const [showForm, setShowForm] = useState<boolean>(!isConnected);

  useEffect(() => {
    // Preencher com valores padrão se estiverem vazios
    if (!supabaseUrl) {
      setSupabaseUrl('https://wqijkkbxqkpbjbqehlqw.supabase.co');
    }
    if (!supabaseKey) {
      setSupabaseKey('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxaWpra2J4cWtwYmpicWVobHF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2ODcwNDYsImV4cCI6MjA1ODI2MzA0Nn0.IerDihb1CqSIVqootaphhkBUG4maAhLiVkqapvGWLhU');
    }

    // Se já temos credenciais salvas e não estamos conectados, tente conectar
    if (supabaseUrl && supabaseKey && !isConnected) {
      console.log("SupabaseConnector - Tentando conectar com credenciais existentes");
      onConnect({ supabaseUrl, supabaseKey });
    }
  }, [supabaseUrl, supabaseKey, isConnected, onConnect]);

  const handleConnect = () => {
    if (!supabaseUrl || !supabaseKey) {
      toast.error("Preencha todos os campos");
      return;
    }

    // Salvar no localStorage
    localStorage.setItem('supabaseUrl', supabaseUrl);
    localStorage.setItem('supabaseKey', supabaseKey);
    console.log("SupabaseConnector - Credenciais salvas no localStorage");

    // Notificar o componente pai
    onConnect({ supabaseUrl, supabaseKey });
    setShowForm(false);
    toast.success("Credenciais salvas! Tentando conectar ao Supabase...");
  };

  const handleDisconnect = () => {
    localStorage.removeItem('supabaseUrl');
    localStorage.removeItem('supabaseKey');
    setSupabaseUrl('');
    setSupabaseKey('');
    setShowForm(true);
    toast.info("Desconectado do Supabase");
    window.location.reload();
  };

  const handleUseDefaultCredentials = () => {
    const defaultUrl = 'https://wqijkkbxqkpbjbqehlqw.supabase.co';
    const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxaWpra2J4cWtwYmpicWVobHF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2ODcwNDYsImV4cCI6MjA1ODI2MzA0Nn0.IerDihb1CqSIVqootaphhkBUG4maAhLiVkqapvGWLhU';
    
    setSupabaseUrl(defaultUrl);
    setSupabaseKey(defaultKey);
    
    // Salvar no localStorage
    localStorage.setItem('supabaseUrl', defaultUrl);
    localStorage.setItem('supabaseKey', defaultKey);
    
    // Notificar o componente pai
    onConnect({ supabaseUrl: defaultUrl, supabaseKey: defaultKey });
    setShowForm(false);
    toast.success("Credenciais padrão aplicadas! Tentando conectar ao Supabase...");
    
    // Recarregar a página para aplicar as novas credenciais
    setTimeout(() => {
      window.location.reload();
    }, 2000);
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
        >
          <RefreshCw className="h-4 w-4" />
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
        <Button onClick={handleConnect} className="w-full">
          Conectar ao Supabase
        </Button>
      </CardFooter>
    </Card>
  );
}
