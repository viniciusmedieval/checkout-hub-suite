
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { method } = req;
    console.log(`Processing ${method} request to save-config`);

    if (method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get request data
    const requestData = await req.json();
    console.log('Received request data:', JSON.stringify(requestData));

    // Validate required fields
    if (!requestData.cor_fundo || !requestData.cor_texto || !requestData.texto_botao) {
      console.error('Missing required fields in request data');
      return new Response(JSON.stringify({ 
        error: 'Campos obrigatórios faltando. Verifique cor_fundo, cor_texto e texto_botao.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      return new Response(JSON.stringify({ error: 'Configuração do servidor incompleta' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Prepare data - include all possible fields
    const configData = {
      // Basic colors
      cor_fundo: requestData.cor_fundo,
      cor_texto: requestData.cor_texto,
      cor_texto_topo: requestData.cor_texto_topo,
      cor_topo: requestData.cor_topo,
      cor_titulo: requestData.cor_titulo,
      cor_botao: requestData.cor_botao,
      cor_texto_botao: requestData.cor_texto_botao,
      
      // Button texts
      texto_botao: requestData.texto_botao,
      texto_botao_card: requestData.texto_botao_card,
      texto_botao_pix: requestData.texto_botao_pix,
      
      // Card button colors
      cor_botao_card: requestData.cor_botao_card,
      cor_texto_botao_card: requestData.cor_texto_botao_card,
      
      // PIX button colors
      cor_botao_pix: requestData.cor_botao_pix,
      cor_texto_botao_pix: requestData.cor_texto_botao_pix,
      
      // Banner settings
      ativa_banner: requestData.ativa_banner,
      banner_url: requestData.banner_url,
      banner_mobile_url: requestData.banner_mobile_url,
      cor_banner: requestData.cor_banner,
      
      // Top message
      mensagem_topo: requestData.mensagem_topo,
      
      // Footer settings
      rodape_texto: requestData.rodape_texto,
      rodape_empresa: requestData.rodape_empresa,
      rodape_ano: requestData.rodape_ano,
      mensagem_rodape: requestData.mensagem_rodape,
      
      // Links
      url_termos_uso: requestData.url_termos_uso,
      url_politica_privacidade: requestData.url_politica_privacidade,
      mensagem_termos: requestData.mensagem_termos,
      
      // Form fields settings
      mostrar_seguro: requestData.mostrar_seguro,
      mostrar_campo_documento: requestData.mostrar_campo_documento,
      mostrar_campo_telefone: requestData.mostrar_campo_telefone,
      mostrar_campo_nascimento: requestData.mostrar_campo_nascimento,
      mostrar_bandeira_brasil: requestData.mostrar_bandeira_brasil,
      mostrar_prefixo_telefone: requestData.mostrar_prefixo_telefone,
      titulo_identificacao: requestData.titulo_identificacao,
      titulo_pagamento: requestData.titulo_pagamento,
      
      // Form validation
      validar_cpf: requestData.validar_cpf,
      validar_telefone: requestData.validar_telefone,
      validar_cartao: requestData.validar_cartao,
      validar_nascimento: requestData.validar_nascimento,
      
      // Counter settings
      mostrar_contador: requestData.mostrar_contador,
      texto_contador: requestData.texto_contador,
      contador_min: requestData.contador_min,
      contador_max: requestData.contador_max,
      cor_texto_contador: requestData.cor_texto_contador,
      
      // Icon settings
      cor_icones: requestData.cor_icones,
      icone_nome: requestData.icone_nome,
      icone_email: requestData.icone_email,
      icone_telefone: requestData.icone_telefone,
      icone_documento: requestData.icone_documento,
      
      // Redirect settings
      redirect_card_status: requestData.redirect_card_status,
      
      // PIX settings
      pix_titulo: requestData.pix_titulo,
      pix_subtitulo: requestData.pix_subtitulo,
      pix_instrucoes: requestData.pix_instrucoes,
      pix_mensagem_seguranca: requestData.pix_mensagem_seguranca,
      cor_primaria_pix: requestData.cor_primaria_pix,
      cor_secundaria_pix: requestData.cor_secundaria_pix,
      tipo_chave_pix_global: requestData.tipo_chave_pix_global,
      chave_pix_global: requestData.chave_pix_global,
      nome_beneficiario_pix: requestData.nome_beneficiario_pix,
      qr_code_pix_url: requestData.qr_code_pix_url,
      usar_api_pix_global: requestData.usar_api_pix_global,
      url_api_pix_global: requestData.url_api_pix_global,
      
      // Random mode
      modo_random: requestData.modo_random,
      
      // Installments
      max_installments: requestData.max_installments,
      
      // PIX section ID
      pix_secao_id: requestData.pix_secao_id,
      
      // Testimonials
      mostrar_depoimentos: requestData.mostrar_depoimentos,
      
      // Slug
      slug: requestData.slug
    };

    console.log('Processing configuration data:', JSON.stringify(configData));

    // Check if we need to update or insert
    let result;
    if (requestData.id) {
      console.log(`Updating existing config with ID ${requestData.id}`);
      const { data, error } = await supabase
        .from('config_checkout')
        .update(configData)
        .eq('id', requestData.id)
        .select();
      
      if (error) {
        console.error('Error updating config:', error);
        throw error;
      }
      result = data;
    } else {
      console.log('Creating new config record');
      const { data, error } = await supabase
        .from('config_checkout')
        .insert(configData)
        .select();
      
      if (error) {
        console.error('Error inserting config:', error);
        throw error;
      }
      result = data;
    }

    console.log('Operation successful:', JSON.stringify(result));
    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in save-config function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
