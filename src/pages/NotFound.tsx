
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: Rota não encontrada:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] animate-fade-in">
      <div className="space-y-6 text-center">
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-semibold">Página não encontrada</h2>
        <p className="text-muted-foreground max-w-md">
          A página que você está procurando não existe ou foi removida.
        </p>
        <Button onClick={() => navigate("/")} className="mt-4">
          Voltar para Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
