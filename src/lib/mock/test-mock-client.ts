
import { supabase } from '../supabase';
import { mockStorage } from './storage-utils';

// Simple function to test the mock client functionality
export async function testMockClient() {
  console.log('---- Testing Mock Client ----');
  
  // Reset mock storage for testing
  mockStorage.test_table = [
    { id: 1, name: 'Test Item 1', active: true },
    { id: 2, name: 'Test Item 2', active: false },
  ];
  
  console.log('Initial mock data:', mockStorage.test_table);
  
  // Test SELECT operation
  console.log('\nTesting SELECT operation:');
  const { data: selectData } = await supabase
    .from('test_table')
    .select();
  console.log('Select result:', selectData);
  
  // Test SELECT with filter
  console.log('\nTesting SELECT with filter:');
  const { data: filteredData } = await supabase
    .from('test_table')
    .select()
    .eq('active', true);
  console.log('Filtered select result:', filteredData);
  
  // Test INSERT operation
  console.log('\nTesting INSERT operation:');
  await supabase
    .from('test_table')
    .insert({ id: 3, name: 'Test Item 3', active: true });
  
  const { data: afterInsertData } = await supabase
    .from('test_table')
    .select();
  console.log('Data after insert:', afterInsertData);
  
  // Test UPDATE operation
  console.log('\nTesting UPDATE operation:');
  await supabase
    .from('test_table')
    .update({ name: 'Updated Test Item', active: false })
    .eq('id', 1);
  
  const { data: afterUpdateData } = await supabase
    .from('test_table')
    .select();
  console.log('Data after update:', afterUpdateData);
  
  // Test DELETE operation
  console.log('\nTesting DELETE operation:');
  await supabase
    .from('test_table')
    .delete()
    .eq('id', 2);
  
  const { data: afterDeleteData } = await supabase
    .from('test_table')
    .select();
  console.log('Data after delete:', afterDeleteData);
  
  console.log('\n---- Mock Client Test Complete ----');
  
  return {
    selectWorking: selectData && selectData.length === 2,
    filteredSelectWorking: filteredData && filteredData.length === 1,
    insertWorking: afterInsertData && afterInsertData.length === 3,
    updateWorking: afterUpdateData && afterUpdateData.some(item => item.name === 'Updated Test Item'),
    deleteWorking: afterDeleteData && afterDeleteData.length === 2 && !afterDeleteData.some(item => item.id === 2)
  };
}
