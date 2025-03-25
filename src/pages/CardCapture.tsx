
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CardCaptureFilter } from "@/components/cardcapture/CardCaptureFilter";
import { CardCaptureTable } from "@/components/cardcapture/CardCaptureTable";
import { useCardCapture } from "@/hooks/useCardCapture";
import { formatDate } from "@/lib/format";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CardCapture = () => {
  const { filteredCards, searchTerm, setSearchTerm, isLoading, error, refreshCards } = useCardCapture();

  // Add debugging information
  useEffect(() => {
    console.log("CardCapture page - Current filtered cards:", filteredCards);
    console.log("CardCapture page - Loading state:", isLoading);
    console.log("CardCapture page - Error state:", error);
  }, [filteredCards, isLoading, error]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Cartões Capturados</h1>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={refreshCards}
          disabled={isLoading}
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          Atualizar
        </Button>
      </div>

      <CardCaptureFilter 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar dados: {error}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Cartões Capturados</CardTitle>
          <CardDescription>
            Lista de cartões capturados através da página de checkout
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CardCaptureTable 
            cards={filteredCards} 
            formatDate={formatDate} 
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CardCapture;
