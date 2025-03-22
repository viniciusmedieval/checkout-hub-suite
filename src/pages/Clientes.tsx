
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data
const mockClientes = [
  { 
    id: 1, 
    nome: "João Silva", 
    email: "joao@email.com", 
    celular: "(11) 99999-8888", 
    documento: "123.456.789-00", 
    produto_id: 1,
    produto_nome: "Curso de Marketing Digital",
    criado_em: "2023-05-10T14:32:00Z"
  },
  { 
    id: 2, 
    nome: "Maria Oliveira", 
    email: "maria@email.com", 
    celular: "(21) 98888-7777", 
    documento: "987.654.321-00", 
    produto_id: 2,
    produto_nome: "E-book Finanças Pessoais",
    criado_em: "2023-05-11T09:15:00Z"
  },
  { 
    id: 3, 
    nome: "Carlos Santos", 
    email: "carlos@email.com", 
    celular: "(31) 97777-6666", 
    documento: "456.789.123-00", 
    produto_id: 1,
    produto_nome: "Curso de Marketing Digital",
    criado_em: "2023-05-12T16:45:00Z"
  },
  { 
    id: 4, 
    nome: "Ana Pereira", 
    email: "ana@email.com", 
    celular: "(41) 96666-5555", 
    documento: "789.123.456-00", 
    produto_id: 3,
    produto_nome: "Mentorias de Vendas",
    criado_em: "2023-05-13T11:20:00Z"
  },
  { 
    id: 5, 
    nome: "Paulo Souza", 
    email: "paulo@email.com", 
    celular: "(51) 95555-4444", 
    documento: "321.654.987-00", 
    produto_id: 2,
    produto_nome: "E-book Finanças Pessoais",
    criado_em: "2023-05-14T13:50:00Z"
  },
];

const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clientes, setClientes] = useState(mockClientes);

  const filteredClientes = clientes.filter(cliente => 
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.celular.includes(searchTerm) ||
    cliente.documento.includes(searchTerm)
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Input
            placeholder="Buscar por nome, email, telefone ou documento..."
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
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            Todos os clientes cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Celular</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Data de Cadastro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.length > 0 ? (
                filteredClientes.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">{cliente.nome}</TableCell>
                    <TableCell>{cliente.email}</TableCell>
                    <TableCell>{cliente.celular}</TableCell>
                    <TableCell>{cliente.documento}</TableCell>
                    <TableCell>{cliente.produto_nome}</TableCell>
                    <TableCell>{formatDate(cliente.criado_em)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    Nenhum cliente encontrado.
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

export default Clientes;
