
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { testMockClient } from "@/lib/mock/test-mock-client";
import { CheckCircle, XCircle } from "lucide-react";

const Index = () => {
  const [testResults, setTestResults] = useState<Record<string, boolean> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const runTest = async () => {
    setIsLoading(true);
    try {
      const results = await testMockClient();
      setTestResults(results);
    } catch (error) {
      console.error("Error running tests:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      <Card className="max-w-md w-full glass-card mb-4">
        <CardContent className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-center text-white">Checkout Digital</h1>
          <p className="text-gray-300 text-center">
            Uma plataforma completa para vendas online
          </p>
          
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/produtos">Ver Produtos</Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link to="/dashboard">Ir para Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="max-w-md w-full">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Teste do Mock Client</h2>
          
          <Button 
            onClick={runTest} 
            disabled={isLoading} 
            className="w-full"
          >
            {isLoading ? "Executando testes..." : "Testar Mock Client"}
          </Button>
          
          {testResults && (
            <div className="space-y-2 mt-4">
              <h3 className="font-medium">Resultados:</h3>
              {Object.entries(testResults).map(([test, passed]) => (
                <div key={test} className="flex items-center">
                  {passed ? (
                    <CheckCircle className="text-green-500 mr-2 h-5 w-5" />
                  ) : (
                    <XCircle className="text-red-500 mr-2 h-5 w-5" />
                  )}
                  <span>
                    {test.replace(/Working$/, '')}: {passed ? "Ok" : "Falha"}
                  </span>
                </div>
              ))}
              
              {Object.values(testResults).every(result => result) ? (
                <Alert className="bg-green-500/20 border-green-500 mt-4">
                  <AlertTitle>Sucesso!</AlertTitle>
                  <AlertDescription>
                    Todas as operações do mock client estão funcionando corretamente.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="bg-red-500/20 border-red-500 mt-4">
                  <AlertTitle>Atenção!</AlertTitle>
                  <AlertDescription>
                    Algumas operações do mock client não estão funcionando corretamente.
                    Verifique os imports e a implementação.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
