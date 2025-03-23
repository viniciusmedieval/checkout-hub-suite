
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCheckoutData } from "./useCheckoutData";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export type PaymentMethod = 'card' | 'pix';
export type FormData = {
  nome: string;
  email: string;
  telefone: string;
  documento: string;
  observacoes: string;
};

export const useCheckout = () => {
  const { slug } = useParams<{ slug: string }>();
  const { produto, configCheckout, loading, error } = useCheckoutData(slug);
  
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    telefone: "",
    documento: "",
    observacoes: ""
  });

  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(15 * 60); // 15 minutes in seconds
  const [visitorCount] = useState(Math.floor(Math.random() * 20000) + 10000);

  // Reset form errors when input changes
  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, boolean> = {};
    
    if (!formData.nome.trim()) errors.nome = true;
    if (!formData.email.trim() || !validateEmail(formData.email)) errors.email = true;
    if (!formData.telefone.trim() || formData.telefone.replace(/\D/g, '').length < 10) errors.telefone = true;
    if (!formData.documento.trim() || !validateDocument(formData.documento)) errors.documento = true;
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit order
  const submitOrder = async () => {
    if (!validateForm()) {
      toast.error("Por favor, corrija os campos destacados");
      return;
    }

    if (!produto) {
      toast.error("Produto não encontrado");
      return;
    }

    setIsSubmitting(true);

    try {
      // Dados do cliente para inserir no Supabase
      const clienteData = {
        nome: formData.nome,
        email: formData.email,
        celular: formData.telefone,
        documento: formData.documento,
        produto_id: produto.id,
        criado_em: new Date().toISOString()
      };

      // Inserir na tabela clientes
      const { data, error } = await supabase
        .from('clientes')
        .insert([clienteData]);

      if (error) throw error;

      toast.success("Pedido finalizado com sucesso!");
      
      // Reset form after successful submission
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        documento: "",
        observacoes: ""
      });
      
      // Redirect to thank you page or show success message
      // window.location.href = `/obrigado/${slug}`;
      
    } catch (error) {
      console.error("Erro ao processar pedido:", error);
      toast.error("Ocorreu um erro ao processar seu pedido. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper functions
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateDocument = (document: string) => {
    // Simple validation - should be replaced with proper CPF/CNPJ validation
    const numbers = document.replace(/\D/g, '');
    return numbers.length >= 11;
  };

  return {
    produto,
    configCheckout,
    loading,
    error,
    formData,
    formErrors,
    paymentMethod,
    isSubmitting,
    countdown,
    visitorCount,
    handleInputChange,
    setPaymentMethod,
    submitOrder,
    validateForm
  };
};
