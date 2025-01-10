import { testDatabaseConnection, testTableAccess } from '../src/lib/db/testConnection';

async function runTests() {
  console.log('Testing database connection...\n');
  
  // Test basic connection
  const connectionResult = await testDatabaseConnection();
  if (!connectionResult.success) {
    console.error('Failed to connect to database:', connectionResult.error);
    process.exit(1);
  }

  console.log('\nTesting table access...\n');
  
  // Test table access
  const tableResult = await testTableAccess();
  if (!tableResult.success) {
    console.error('Failed to access tables:', tableResult.error);
    process.exit(1);
  }

  console.log('\nAll tests completed successfully!');
  console.log('Table counts:', tableResult.counts);
}

runTests().catch(error => {
  console.error('Test script failed:', error);
  process.exit(1);
}); 