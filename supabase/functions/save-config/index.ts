
// This is a refactored version of the save-config Edge Function
// with improved modularity and maintainability

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.8.0'

// Common types and constants
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type ConfigCheckout = {
  id?: number;
  texto_botao?: string;
  cor_fundo?: string;
  cor_texto?: string;
  cor_botao?: string;
  [key: string]: any;  // Allow other properties
}

// Validation functions
function validateCheckoutConfig(config: ConfigCheckout): { valid: boolean; errors: string[] } {
  const validationErrors: string[] = [];
  
  if (config.texto_botao === '') {
    validationErrors.push('Texto do botão não pode estar vazio');
  }
  
  // Validate color format for testing fields
  if (config.cor_fundo && !config.cor_fundo.match(/^#([0-9A-F]{6}|[0-9A-F]{3})$/i)) {
    validationErrors.push('Cor de fundo deve estar no formato hexadecimal (#RRGGBB)');
  }
  
  if (config.cor_texto && !config.cor_texto.match(/^#([0-9A-F]{6}|[0-9A-F]{3})$/i)) {
    validationErrors.push('Cor do texto deve estar no formato hexadecimal (#RRGGBB)');
  }
  
  return {
    valid: validationErrors.length === 0,
    errors: validationErrors
  };
}

function isTestConfig(config: ConfigCheckout): boolean {
  return (
    config.cor_fundo === '#FF0000' && 
    config.cor_texto === '#FFFFFF' && 
    config.texto_botao === 'Finalizar Compra'
  );
}

// Database operations
async function testDatabaseConnection(supabase: any): Promise<void> {
  try {
    const { count, error: countError } = await supabase
      .from('config_checkout')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      throw new Error(`Database connection test failed: ${countError.message}`);
    }
  } catch (error: any) {
    throw new Error(`Database connection error: ${error.message}`);
  }
}

async function updateExistingConfig(supabase: any, config: ConfigCheckout): Promise<any> {
  const { data, error } = await supabase
    .from('config_checkout')
    .update(config)
    .eq('id', config.id)
    .select('*');
  
  if (error) {
    throw new Error(`Error updating config: ${error.message}`);
  }
  
  if (!data || data.length === 0) {
    throw new Error('No data returned after update');
  }
  
  return data;
}

async function insertNewConfig(supabase: any, config: ConfigCheckout): Promise<any> {
  const { data, error } = await supabase
    .from('config_checkout')
    .insert(config)
    .select('*');
  
  if (error) {
    throw new Error(`Error inserting config: ${error.message}`);
  }
  
  if (!data || data.length === 0) {
    throw new Error('No data returned after insert');
  }
  
  return data;
}

// Response generators
function generateSuccessResponse(data: any): Response {
  return new Response(
    JSON.stringify({
      success: true,
      message: 'Configuração salva com sucesso',
      data
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

function generateErrorResponse(message: string, details?: any, status: number = 500): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: true,
      message,
      details
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status,
    }
  );
}

function generateValidationErrorResponse(errors: string[]): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: true,
      message: `Erro de validação: ${errors.join(', ')}`,
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    }
  );
}

// Main handler function
Deno.serve(async (req) => {
  console.log("Edge Function: save-config called with method:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("CORS preflight request received");
    return new Response('ok', { headers: corsHeaders });
  }

  // Create a Supabase client with the Auth context of the function
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Get the request body
    const requestBody = await req.text();
    console.log("Request body received:", requestBody.substring(0, 200) + "...");
    
    const config: ConfigCheckout = JSON.parse(requestBody);
    console.log('Received config data:', JSON.stringify(config, null, 2));
    
    // Check if this is a test configuration
    const isTestingConfig = isTestConfig(config);
    if (isTestingConfig) {
      console.log('🧪 TESTE AUTOMÁTICO DETECTADO! Valores de teste recebidos:');
      console.log(`🧪 cor_fundo: ${config.cor_fundo} (esperado: #FF0000) ✅`);
      console.log(`🧪 cor_texto: ${config.cor_texto} (esperado: #FFFFFF) ✅`);
      console.log(`🧪 texto_botao: ${config.texto_botao} (esperado: Finalizar Compra) ✅`);
    }
    
    // Validate configuration
    const validation = validateCheckoutConfig(config);
    if (!validation.valid) {
      console.error("Validation errors:", validation.errors);
      return generateValidationErrorResponse(validation.errors);
    }
    
    // Test database connection
    try {
      await testDatabaseConnection(supabase);
    } catch (dbConnectionError: any) {
      console.error('Database connection error:', dbConnectionError);
      return generateErrorResponse(`Erro de conexão com banco de dados: ${dbConnectionError.message}`);
    }
    
    // Perform database operation (insert or update)
    let result;
    try {
      if (config.id) {
        console.log(`Updating config with ID: ${config.id}`);
        result = await updateExistingConfig(supabase, config);
      } else {
        console.log('Inserting new config');
        result = await insertNewConfig(supabase, config);
      }
    } catch (dbOperationError: any) {
      console.error('Database operation error:', dbOperationError);
      
      if (isTestingConfig) {
        console.error('🧪 TESTE AUTOMÁTICO FALHOU: Erro de banco de dados ❌');
      }
      
      return generateErrorResponse(`Erro de banco de dados: ${dbOperationError.message}`);
    }
    
    // Log test success if applicable
    if (isTestingConfig) {
      console.log('🧪 TESTE AUTOMÁTICO BEM-SUCEDIDO! ✅');
      console.log('🧪 Valores de teste foram salvos no banco de dados!');
      console.log('Saved config result:', JSON.stringify(result, null, 2));
      
      // Additional verification of saved values
      if (result && result.length > 0) {
        const saved = result[0];
        console.log('🧪 VERIFICAÇÃO DOS VALORES SALVOS:');
        console.log(`  cor_fundo: ${saved.cor_fundo} (esperado: #FF0000) ${saved.cor_fundo === '#FF0000' ? '✅' : '❌'}`);
        console.log(`  cor_texto: ${saved.cor_texto} (esperado: #FFFFFF) ${saved.cor_texto === '#FFFFFF' ? '✅' : '❌'}`);
        console.log(`  texto_botao: ${saved.texto_botao} (esperado: Finalizar Compra) ${saved.texto_botao === 'Finalizar Compra' ? '✅' : '❌'}`);
      }
    }
    
    return generateSuccessResponse(result);
  } catch (error: any) {
    console.error('Error in save-config function:', error);
    return generateErrorResponse(`Erro ao salvar configuração: ${error.message}`);
  }
});
