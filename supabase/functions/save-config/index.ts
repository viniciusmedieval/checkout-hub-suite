
// This is a sample to ensure proper config handling in the Edge Function
// You should implement your own validation and saving logic here

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.8.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Create a Supabase client with the Auth context of the function
const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
const supabase = createClient(supabaseUrl, supabaseKey)

type ConfigCheckout = {
  id?: number;
  texto_botao?: string;
  cor_fundo?: string;
  cor_texto?: string; // Make sure this field is included
  cor_botao?: string;
  [key: string]: any;  // Allow other properties
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the request body
    const config: ConfigCheckout = await req.json()
    
    console.log('Received config data:', config)
    
    // Special log for test values
    if (config.cor_fundo === '#FF0000' && config.cor_texto === '#FFFFFF' && config.texto_botao === 'Finalizar Compra') {
      console.log('🧪 TESTE DETECTADO! Valores de teste recebidos:')
      console.log(`🧪 cor_fundo: ${config.cor_fundo} (esperado: #FF0000) ✅`)
      console.log(`🧪 cor_texto: ${config.cor_texto} (esperado: #FFFFFF) ✅`)
      console.log(`🧪 texto_botao: ${config.texto_botao} (esperado: Finalizar Compra) ✅`)
    }
    
    // Validate required fields for testing
    const validationErrors = []
    
    if (config.texto_botao === '') {
      validationErrors.push('Texto do botão não pode estar vazio')
    }
    
    // Validate color format for testing fields
    if (config.cor_fundo && !config.cor_fundo.match(/^#([0-9A-F]{6}|[0-9A-F]{3})$/i)) {
      validationErrors.push('Cor de fundo deve estar no formato hexadecimal (#RRGGBB)')
    }
    
    if (config.cor_texto && !config.cor_texto.match(/^#([0-9A-F]{6}|[0-9A-F]{3})$/i)) {
      validationErrors.push('Cor do texto deve estar no formato hexadecimal (#RRGGBB)')
    }
    
    if (validationErrors.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: true,
          message: `Erro de validação: ${validationErrors.join(', ')}`,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }
    
    // Check if update or insert
    let result
    
    if (config.id) {
      console.log(`Updating config with ID: ${config.id}`)
      
      // Update existing config
      const { data, error } = await supabase
        .from('config_checkout')
        .update(config)
        .eq('id', config.id)
        .select()
      
      if (error) throw error
      result = data
    } else {
      console.log('Inserting new config')
      
      // Insert new config
      const { data, error } = await supabase
        .from('config_checkout')
        .insert(config)
        .select()
      
      if (error) throw error
      result = data
    }
    
    // Special log for test success
    if (config.cor_fundo === '#FF0000' && config.cor_texto === '#FFFFFF' && config.texto_botao === 'Finalizar Compra') {
      console.log('🧪 TESTE BEM-SUCEDIDO! Valores de teste foram salvos no banco de dados! ✅')
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Configuração salva com sucesso',
        data: result
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in save-config function:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: true,
        message: `Erro ao salvar configuração: ${error.message}`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
