import pg from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface TableRow {
  table_name: string;
}

interface CountResult {
  count: string;
}

// Create a connection pool with direct Supabase connection
const pool = new pg.Pool({
  host: process.env.SUPABASE_DB_HOST,
  port: parseInt(process.env.SUPABASE_DB_PORT || '5432'),
  database: process.env.SUPABASE_DB_NAME,
  user: process.env.SUPABASE_DB_USER,
  password: process.env.SUPABASE_DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function testDatabaseConnection() {
  try {
    // Test the connection
    const client = await pool.connect();
    console.log('Successfully connected to the database');

    // Test a simple query
    const result = await client.query('SELECT NOW()');
    console.log('Database time:', result.rows[0].now);

    // Test tables
    const tables: pg.QueryResult<TableRow> = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('\nAvailable tables:');
    tables.rows.forEach(row => console.log('-', row.table_name));

    // Release the client
    client.release();
    
    return {
      success: true,
      timestamp: result.rows[0].now,
      tables: tables.rows.map(row => row.table_name)
    };
  } catch (error) {
    console.error('Database connection error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  } finally {
    // End the pool
    await pool.end();
  }
}

// Create a function to test specific tables
export async function testTableAccess() {
  const client = await pool.connect();
  try {
    // Test races table
    const races: pg.QueryResult<CountResult> = await client.query('SELECT COUNT(*) FROM races');
    console.log('\nRaces count:', races.rows[0].count);

    // Test character_classes table
    const classes: pg.QueryResult<CountResult> = await client.query('SELECT COUNT(*) FROM character_classes');
    console.log('Character classes count:', classes.rows[0].count);

    // Test character_attributes table
    const attributes: pg.QueryResult<CountResult> = await client.query('SELECT COUNT(*) FROM character_attributes');
    console.log('Character attributes count:', attributes.rows[0].count);

    // Test equipment_items table
    const equipment: pg.QueryResult<CountResult> = await client.query('SELECT COUNT(*) FROM equipment_items');
    console.log('Equipment items count:', equipment.rows[0].count);

    return {
      success: true,
      counts: {
        races: parseInt(races.rows[0].count),
        classes: parseInt(classes.rows[0].count),
        attributes: parseInt(attributes.rows[0].count),
        equipment: parseInt(equipment.rows[0].count)
      }
    };
  } catch (error) {
    console.error('Table access error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  } finally {
    client.release();
    await pool.end();
  }
} 