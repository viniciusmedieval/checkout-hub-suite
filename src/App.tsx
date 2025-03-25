
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
import Checkout from "./pages/Checkout";
import PaymentStatus from "./pages/PaymentStatus";
import PixPaymentPage from "./pages/PixPaymentPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <Layout>
              <Dashboard />
            </Layout>
          } />
          <Route path="/produtos" element={
            <Layout>
              <Produtos />
            </Layout>
          } />
          <Route path="/configuracao" element={
            <Layout>
              <Configuracao />
            </Layout>
          } />
          <Route path="/pix" element={
            <Layout>
              <Pix />
            </Layout>
          } />
          <Route path="/pixels" element={
            <Layout>
              <Pixels />
            </Layout>
          } />
          <Route path="/webhooks" element={
            <Layout>
              <Webhooks />
            </Layout>
          } />
          <Route path="/cardcapture" element={
            <Layout>
              <CardCapture />
            </Layout>
          } />
          <Route path="/clientes" element={
            <Layout>
              <Clientes />
            </Layout>
          } />
          <Route path="/vendas" element={
            <Layout>
              <Vendas />
            </Layout>
          } />
          <Route path="/checkout/:slug" element={<Checkout />} />
          <Route path="/pix-payment/:slug" element={<PixPaymentPage />} />
          <Route path="/payment-status/:slug/:status" element={<PaymentStatus />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
