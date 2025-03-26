
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

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Prepare data
    const configData = {
      cor_fundo: requestData.cor_fundo || '#FFFFFF',
      cor_texto: requestData.cor_texto || '#000000',
      cor_botao: requestData.cor_botao || '#8B5CF6',
      cor_texto_botao: requestData.cor_texto_botao || '#FFFFFF',
      texto_botao: requestData.texto_botao || 'Finalizar Compra',
      mensagem_topo: requestData.mensagem_topo || '',
      // Save other fields from requestData
      ...requestData
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
      
      if (error) throw error;
      result = data;
    } else {
      console.log('Creating new config record');
      const { data, error } = await supabase
        .from('config_checkout')
        .insert(configData)
        .select();
      
      if (error) throw error;
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
