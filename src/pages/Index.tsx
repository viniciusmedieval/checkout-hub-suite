
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      <Card className="max-w-md w-full glass-card">
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
    </div>
  );
};

export default Index;
