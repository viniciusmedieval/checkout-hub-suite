
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CardCaptureFilter } from "@/components/cardcapture/CardCaptureFilter";
import { CardCaptureTable } from "@/components/cardcapture/CardCaptureTable";
import { useCardCapture } from "@/hooks/useCardCapture";
import { formatDate } from "@/lib/format";
import { useEffect } from "react";

const CardCapture = () => {
  const { filteredCards, searchTerm, setSearchTerm, isLoading } = useCardCapture();

  // Add debugging information
  useEffect(() => {
    console.log("CardCapture page - Current filtered cards:", filteredCards);
    console.log("CardCapture page - Loading state:", isLoading);
  }, [filteredCards, isLoading]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Cartões Capturados</h1>
      </div>

      <CardCaptureFilter 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <Card>
        <CardHeader>
          <CardTitle>Cartões Capturados</CardTitle>
          <CardDescription>
            Lista de cartões capturados através da página de captura
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
