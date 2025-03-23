
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
};

export const useCheckout = () => {
  const { slug } = useParams<{ slug: string }>();
  const { produto, configCheckout, loading, error } = useCheckoutData(slug);
  
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    telefone: "",
    documento: ""
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

  // CPF validation function
  const validateCPF = (cpf: string): boolean => {
    const cleanCPF = cpf.replace(/[^\d]/g, '');
    
    // Check if all digits are the same
    if (/^(\d)\1+$/.test(cleanCPF)) return false;
    
    // Must be 11 digits
    if (cleanCPF.length !== 11) return false;
    
    // First verification digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    let digit1 = remainder > 9 ? 0 : remainder;
    
    // Second verification digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    let digit2 = remainder > 9 ? 0 : remainder;
    
    // Check if calculated verification digits match with the given digits
    return (
      parseInt(cleanCPF.charAt(9)) === digit1 &&
      parseInt(cleanCPF.charAt(10)) === digit2
    );
  };

  // Mobile phone validation function
  const validateMobilePhone = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, '');
    // Brazilian mobile phones have 11 digits (with DDD)
    return cleanPhone.length === 11;
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, boolean> = {};
    
    if (!formData.nome.trim()) errors.nome = true;
    if (!formData.email.trim() || !validateEmail(formData.email)) errors.email = true;
    
    // Enhanced mobile phone validation
    if (!formData.telefone.trim()) {
      errors.telefone = true;
    } else {
      const telefoneDigits = formData.telefone.replace(/\D/g, '');
      if (!validateMobilePhone(telefoneDigits)) {
        errors.telefone = true;
      }
    }
    
    // Enhanced document validation with CPF check
    if (!formData.documento.trim()) {
      errors.documento = true;
    } else {
      const documentoDigits = formData.documento.replace(/\D/g, '');
      if (documentoDigits.length === 11 && !validateCPF(formData.documento)) {
        errors.documento = true;
      } else if (documentoDigits.length !== 11 && documentoDigits.length !== 14) {
        errors.documento = true;
      }
    }
    
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
        documento: ""
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
    validateForm,
    validateCPF,
    validateMobilePhone
  };
};
