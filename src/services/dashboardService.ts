import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

// Fetch total clients
export const fetchTotalClients = async () => {
  const { data, error } = await supabase.from('clientes').select('id');
  if (error) throw error;
  return data.length || 0;
};

// Fetch active products
export const fetchActiveProducts = async () => {
  const { data, error } = await supabase
    .from('produtos')
    .select('id')
    .eq('ativo', true);
  if (error) throw error;
  return data.length || 0;
};

// Fetch total sales amount
export const fetchTotalSales = async () => {
  const { data, error } = await supabase.from('vendas').select('valor');
  if (error) throw error;
  return data.reduce((sum, venda) => sum + (venda.valor || 0), 0);
};

// Fetch sales vs customers data
export const fetchSalesVsCustomersData = async (startDate: Date, endDate: Date) => {
  // Format the date range for query
  const fromDate = format(startDate, 'yyyy-MM-dd');
  const toDate = format(endDate, 'yyyy-MM-dd');
  
  // Fetch sales data for the date range
  const { data: vendasData, error: vendasError } = await supabase
    .from('vendas')
    .select('valor, criado_em')
    .gte('criado_em', `${fromDate}T00:00:00`)
    .lte('criado_em', `${toDate}T23:59:59`);
  
  if (vendasError) throw vendasError;
  
  // Fetch customers data for the date range
  const { data: clientesData, error: clientesError } = await supabase
    .from('clientes')
    .select('id, criado_em')
    .gte('criado_em', `${fromDate}T00:00:00`)
    .lte('criado_em', `${toDate}T23:59:59`);
  
  if (clientesError) throw clientesError;
  
  return { vendasData, clientesData };
};

// Fetch top products data
export const fetchTopProductsData = async (startDate: Date, endDate: Date) => {
  // Format the date range for query
  const fromDate = format(startDate, 'yyyy-MM-dd');
  const toDate = format(endDate, 'yyyy-MM-dd');
  
  // Fetch sales and join with products
  const { data, error } = await supabase
    .from('vendas')
    .select(`
      valor,
      produtos:produto_id (id, nome)
    `)
    .gte('criado_em', `${fromDate}T00:00:00`)
    .lte('criado_em', `${toDate}T23:59:59`);
  
  if (error) throw error;
  
  return data;
};

// Fetch PIX generation data
export const fetchPixGeneratedData = async (startDate: Date, endDate: Date) => {
  // Format the date range for query
  const fromDate = format(startDate, 'yyyy-MM-dd');
  const toDate = format(endDate, 'yyyy-MM-dd');
  
  // Fetch vendas with PIX payment method
  const { data, error } = await supabase
    .from('vendas')
    .select('criado_em, valor')
    .eq('metodo_pagamento', 'pix')
    .gte('criado_em', `${fromDate}T00:00:00`)
    .lte('criado_em', `${toDate}T23:59:59`);
  
  if (error) throw error;
  return data || [];
};

// Fetch card capture data
export const fetchCardCaptureData = async (startDate: Date, endDate: Date) => {
  // Format the date range for query
  const fromDate = format(startDate, 'yyyy-MM-dd');
  const toDate = format(endDate, 'yyyy-MM-dd');
  
  // Fetch card captures
  const { data, error } = await supabase
    .from('card_captures')
    .select('*')
    .gte('criado_em', `${fromDate}T00:00:00`)
    .lte('criado_em', `${toDate}T23:59:59`);
  
  if (error) throw error;
  return data || [];
};
