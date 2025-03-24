
import { useState } from "react";
import { toast } from "sonner";
import { validateEmail, validateCPF, validateMobilePhone } from "./useValidation";
import { supabase } from "@/lib/supabase";
import { Produto } from "@/lib/types/database-types";

export type FormData = {
  nome: string;
  email: string;
  telefone: string;
  documento: string;
};

export const useCheckoutForm = (produto: Produto | null) => {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    telefone: "",
    documento: ""
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return {
    formData,
    formErrors,
    isSubmitting,
    handleInputChange,
    submitOrder,
    validateForm
  };
};
