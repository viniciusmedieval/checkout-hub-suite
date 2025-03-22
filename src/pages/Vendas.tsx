
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data
const mockVendas = [
  { 
    id: 1, 
    cliente_id: 1, 
    cliente_nome: "João Silva",
    produto_id: 1,
    produto_nome: "Curso de Marketing Digital",
    valor: 297.00,
    status: "aprovado",
    metodo_pagamento: "pix",
    criado_em: "2023-05-10T14:32:00Z"
  },
  { 
    id: 2, 
    cliente_id: 2, 
    cliente_nome: "Maria Oliveira",
    produto_id: 2,
    produto_nome: "E-book Finanças Pessoais",
    valor: 47.00,
    status: "aprovado",
    metodo_pagamento: "cartao",
    criado_em: "2023-05-11T09:15:00Z"
  },
  { 
    id: 3, 
    cliente_id: 3, 
    cliente_nome: "Carlos Santos",
    produto_id: 1,
    produto_nome: "Curso de Marketing Digital",
    valor: 297.00,
    status: "pendente",
    metodo_pagamento: "boleto",
    criado_em: "2023-05-12T16:45:00Z"
  },
  { 
    id: 4, 
    cliente_id: 4, 
    cliente_nome: "Ana Pereira",
    produto_id: 3,
    produto_nome: "Mentorias de Vendas",
    valor: 997.00,
    status: "recusado",
    metodo_pagamento: "cartao",
    criado_em: "2023-05-13T11:20:00Z"
  },
  { 
    id: 5, 
    cliente_id: 5, 
    cliente_nome: "Paulo Souza",
    produto_id: 2,
    produto_nome: "E-book Finanças Pessoais",
    valor: 47.00,
    status: "aprovado",
    metodo_pagamento: "pix",
    criado_em: "2023-05-14T13:50:00Z"
  },
];

const Vendas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [vendas] = useState(mockVendas);

  const filteredVendas = vendas.filter(venda => {
    const matchesSearch = 
      venda.cliente_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venda.produto_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venda.valor.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === "todos" || venda.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aprovado':
        return <Badge className="bg-green-600">Aprovado</Badge>;
      case 'pendente':
        return <Badge className="bg-yellow-600">Pendente</Badge>;
      case 'recusado':
        return <Badge variant="destructive">Recusado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'pix':
        return (
          <div className="flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.5 9.5L15.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.5 16.5L15.5 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.5 6C10.7091 6 12.5 4.20914 12.5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.5 6C6.29086 6 4.5 4.20914 4.5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.5 18C13.2909 18 11.5 19.7909 11.5 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.5 18C17.7091 18 19.5 19.7909 19.5 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.5 6C17.2909 6 15.5 4.20914 15.5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.5 6C21.7091 6 23.5 4.20914 23.5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.5 18C6.70914 18 8.5 19.7909 8.5 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.5 18C2.29086 18 0.5 19.7909 0.5 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>PIX</span>
          </div>
        );
      case 'cartao':
        return (
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="14" x="2" y="5" rx="2"/>
              <line x1="2" x2="22" y1="10" y2="10"/>
            </svg>
            <span>Cartão</span>
          </div>
        );
      case 'boleto':
        return (
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <line x1="6" x2="6" y1="8" y2="16"/>
              <line x1="10" x2="10" y1="8" y2="16"/>
              <line x1="14" x2="14" y1="8" y2="16"/>
              <line x1="18" x2="18" y1="8" y2="16"/>
            </svg>
            <span>Boleto</span>
          </div>
        );
      default:
        return method;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Vendas</h1>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1 w-full">
          <Input
            placeholder="Buscar por cliente, produto ou valor..."
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

        <div className="w-full sm:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="aprovado">Aprovado</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="recusado">Recusado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Vendas</CardTitle>
          <CardDescription>
            Todas as transações registradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendas.length > 0 ? (
                filteredVendas.map((venda) => (
                  <TableRow key={venda.id}>
                    <TableCell className="font-medium">{venda.cliente_nome}</TableCell>
                    <TableCell>{venda.produto_nome}</TableCell>
                    <TableCell>R$ {venda.valor.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(venda.status)}</TableCell>
                    <TableCell>{getPaymentMethodIcon(venda.metodo_pagamento)}</TableCell>
                    <TableCell>{formatDate(venda.criado_em)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    Nenhuma venda encontrada.
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

export default Vendas;
