
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
  cor_texto?: string;
  cor_botao?: string;
  [key: string]: any;  // Allow other properties
}

Deno.serve(async (req) => {
  console.log("Edge Function: save-config called with method:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("CORS preflight request received");
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the request body
    const requestBody = await req.text();
    console.log("Request body received:", requestBody.substring(0, 200) + "...");
    
    const config: ConfigCheckout = JSON.parse(requestBody);
    
    console.log('Received config data:', JSON.stringify(config, null, 2));
    
    // Special log for test values
    const isTestConfig = (
      config.cor_fundo === '#FF0000' && 
      config.cor_texto === '#FFFFFF' && 
      config.texto_botao === 'Finalizar Compra'
    );
    
    if (isTestConfig) {
      console.log('🧪 TESTE AUTOMÁTICO DETECTADO! Valores de teste recebidos:')
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
      console.error("Validation errors:", validationErrors);
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
    
    try {
      console.log("Testing database connection before operation");
      const { count, error: countError } = await supabase
        .from('config_checkout')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        throw new Error(`Database connection test failed: ${countError.message}`);
      }
      console.log(`Database connection test successful. Table has ${count} records.`);
      
      if (config.id) {
        console.log(`Updating config with ID: ${config.id}`)
        
        // Update existing config
        const { data, error } = await supabase
          .from('config_checkout')
          .update(config)
          .eq('id', config.id)
          .select('*')
        
        if (error) {
          console.error('Error updating config:', error)
          throw error
        }
        
        if (!data || data.length === 0) {
          console.error('No data returned after update')
          throw new Error('No data returned after update')
        }
        
        console.log('Config updated successfully:', data)
        result = data
      } else {
        console.log('Inserting new config')
        
        // Insert new config
        const { data, error } = await supabase
          .from('config_checkout')
          .insert(config)
          .select('*')
        
        if (error) {
          console.error('Error inserting config:', error)
          throw error
        }
        
        if (!data || data.length === 0) {
          console.error('No data returned after insert')
          throw new Error('No data returned after insert')
        }
        
        console.log('Config inserted successfully:', data)
        result = data
      }
      
      // Special log for test success
      if (isTestConfig) {
        console.log('🧪 TESTE AUTOMÁTICO BEM-SUCEDIDO! ✅')
        console.log('🧪 Valores de teste foram salvos no banco de dados!')
        console.log('Saved config result:', JSON.stringify(result, null, 2))
        
        // Verificação adicional dos valores salvos
        if (result && result.length > 0) {
          const saved = result[0]
          console.log('🧪 VERIFICAÇÃO DOS VALORES SALVOS:')
          console.log(`  cor_fundo: ${saved.cor_fundo} (esperado: #FF0000) ${saved.cor_fundo === '#FF0000' ? '✅' : '❌'}`)
          console.log(`  cor_texto: ${saved.cor_texto} (esperado: #FFFFFF) ${saved.cor_texto === '#FFFFFF' ? '✅' : '❌'}`)
          console.log(`  texto_botao: ${saved.texto_botao} (esperado: Finalizar Compra) ${saved.texto_botao === 'Finalizar Compra' ? '✅' : '❌'}`)
        }
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
    } catch (dbError) {
      console.error('Database error:', dbError)
      
      if (isTestConfig) {
        console.error('🧪 TESTE AUTOMÁTICO FALHOU: Erro de banco de dados ❌')
      }
      
      return new Response(
        JSON.stringify({
          success: false,
          error: true,
          message: `Erro de banco de dados: ${dbError.message || 'Erro desconhecido'}`,
          details: dbError
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }
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
