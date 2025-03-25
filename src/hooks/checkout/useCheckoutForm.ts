
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { validateEmail, validateCPF, validateMobilePhone, validateBirthDate } from "./useValidation";
import { supabase } from "@/lib/supabase";
import { Produto, ConfigCheckout } from "@/lib/supabase";
import { formatCPF, formatPhoneNumber, formatBirthDate } from "@/utils/formatters";

export type FormData = {
  nome: string;
  email: string;
  telefone: string;
  documento: string;
  data_nascimento?: string;
};

export const useCheckoutForm = (produto: Produto | null, configCheckout?: ConfigCheckout | null) => {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    telefone: "",
    documento: "",
    data_nascimento: ""
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine which fields to validate based on config
  const shouldValidateDocumento = configCheckout?.mostrar_campo_documento !== false;
  const shouldValidateTelefone = configCheckout?.mostrar_campo_telefone !== false;
  const shouldShowDataNascimento = configCheckout?.mostrar_campo_nascimento === true;
  const shouldValidateCpf = configCheckout?.validar_cpf === true;
  const shouldValidateTelefoneFormat = configCheckout?.validar_telefone === true;
  const shouldValidateDataNascimento = configCheckout?.validar_nascimento === true;

  // Reset form errors when input changes
  const handleInputChange = (name: string, value: string) => {
    let formattedValue = value;

    // Format values according to their type
    if (name === 'telefone') {
      formattedValue = formatPhoneNumber(value);
    } else if (name === 'documento') {
      formattedValue = formatCPF(value);
    } else if (name === 'data_nascimento') {
      formattedValue = formatBirthDate(value);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, boolean> = {};
    
    if (!formData.nome.trim()) errors.nome = true;
    if (!formData.email.trim() || !validateEmail(formData.email)) errors.email = true;
    
    // Only validate phone if it's required by config
    if (shouldValidateTelefone) {
      if (!formData.telefone.trim()) {
        errors.telefone = true;
      } else if (shouldValidateTelefoneFormat) {
        const telefoneDigits = formData.telefone.replace(/\D/g, '');
        if (!validateMobilePhone(telefoneDigits)) {
          errors.telefone = true;
        }
      }
    }
    
    // Only validate document if it's required by config
    if (shouldValidateDocumento) {
      if (!formData.documento.trim()) {
        errors.documento = true;
      } else if (shouldValidateCpf) {
        const documentoDigits = formData.documento.replace(/\D/g, '');
        if (documentoDigits.length === 11 && !validateCPF(formData.documento)) {
          errors.documento = true;
        } else if (documentoDigits.length !== 11 && documentoDigits.length !== 14) {
          errors.documento = true;
        }
      }
    }
    
    // Validate birth date if field is shown and validation is enabled
    if (shouldShowDataNascimento) {
      if (!formData.data_nascimento?.trim()) {
        errors.data_nascimento = true;
      } else if (shouldValidateDataNascimento) {
        if (!validateBirthDate(formData.data_nascimento)) {
          errors.data_nascimento = true;
        }
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
      console.log("Iniciando processo de envio do pedido");
      
      // Dados do cliente para inserir no Supabase
      const clienteData = {
        nome: formData.nome,
        email: formData.email,
        celular: formData.telefone,
        documento: formData.documento,
        data_nascimento: formData.data_nascimento,
        produto_id: produto.id,
        produto_nome: produto.nome, // Adiciona o nome do produto também
        criado_em: new Date().toISOString()
      };

      // Verificar se o Supabase está disponível
      if (!supabase) {
        console.error("Cliente Supabase não inicializado");
        throw new Error("Serviço de banco de dados não disponível");
      }

      console.log("Enviando dados para o Supabase:", clienteData);
      
      // Inserir na tabela clientes
      const { error } = await supabase
        .from('clientes')
        .insert([clienteData]);

      if (error) {
        console.error("Erro do Supabase:", error);
        throw error;
      }

      console.log("Pedido finalizado com sucesso!");
      toast.success("Pedido finalizado com sucesso!");
      
      // Reset form after successful submission
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        documento: "",
        data_nascimento: ""
      });
    } catch (error: any) {
      console.error("Erro ao processar pedido:", error);
      toast.error(error?.message || "Ocorreu um erro ao processar seu pedido. Tente novamente.");
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
