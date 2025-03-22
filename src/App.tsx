
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Produtos from "./pages/Produtos";
import Configuracao from "./pages/Configuracao";
import Pix from "./pages/Pix";
import Pixels from "./pages/Pixels";
import Webhooks from "./pages/Webhooks";
import CardCapture from "./pages/CardCapture";
import Clientes from "./pages/Clientes";
import Vendas from "./pages/Vendas";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/configuracao" element={<Configuracao />} />
            <Route path="/pix" element={<Pix />} />
            <Route path="/pixels" element={<Pixels />} />
            <Route path="/webhooks" element={<Webhooks />} />
            <Route path="/cardcapture" element={<CardCapture />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/vendas" element={<Vendas />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
