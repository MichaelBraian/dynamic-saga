# Supabase Production Database Connection Guide

## Connection Details

### Database Information
- **Project ID**: ckxcnnvcpitlqmmsekoy
- **Region**: EU North (Stockholm)
- **Database Version**: PostgreSQL 15.8
- **Connection Method**: Connection Pooling

### Connection Strings

#### Direct Connection (Port 5432)
```bash
postgresql://postgres:Odmibr0737William@db.ckxcnnvcpitlqmmsekoy.supabase.co:5432/postgres
```

#### Pooled Connection (Port 6543) - Recommended
```bash
postgresql://postgres.ckxcnnvcpitlqmmsekoy:Odmibr0737William@aws-0-eu-north-1.pooler.supabase.com:6543/postgres
```

## Docker Setup (Recommended Method)

### 1. Create Docker Compose File
Create or update `docker-compose.yml` in the project root:

```yaml
services:
  pg-client:
    image: postgres:15
    environment:
      - POSTGRES_HOST_AUTH_METHOD=trust
    command: sleep infinity
    networks:
      - pg-network

networks:
  pg-network:
    driver: bridge
```

### 2. Start Docker Container
```bash
docker-compose up -d
```

### 3. Connect to Database
```bash
docker-compose exec pg-client psql "postgresql://postgres.ckxcnnvcpitlqmmsekoy:Odmibr0737William@aws-0-eu-north-1.pooler.supabase.com:6543/postgres?sslmode=require"
```

## Quick Database Commands

### View Tables
```sql
\dt
```

### View Table Schema
```sql
\d+ table_name
```

### Common Tables
- profiles
- races
- character_classes
- animal_types
- backgrounds
- faiths
- equipment_items
- race_class_restrictions

## Connection Troubleshooting

### SSL Issues
If you encounter SSL-related errors, ensure you're using:
```bash
?sslmode=require
```
at the end of your connection string.

### Authentication Issues
1. Verify you're using the correct password
2. Ensure you're using the correct username format:
   - For direct connection: `postgres`
   - For pooled connection: `postgres.ckxcnnvcpitlqmmsekoy`

### Connection Refused
1. Check if you're using the correct port:
   - Direct connection: 5432
   - Pooled connection: 6543
2. Verify your IP is whitelisted in Supabase dashboard

## Security Notes

1. **Password Protection**: 
   - The database password is sensitive information
   - Never commit it directly to version control
   - Use environment variables in production

2. **Connection Pooling**:
   - Preferred for production use
   - Handles connection limits automatically
   - Better performance for multiple simultaneous connections

3. **SSL Mode**:
   - Always use `sslmode=require`
   - Ensures encrypted connection
   - Prevents man-in-the-middle attacks

## Verify Connection

To verify you're connected to the production database, run:

```sql
SELECT version(), current_database(), current_user;
```

Expected output should show:
- PostgreSQL 15.8
- Database: postgres
- User: postgres

## Database Statistics

Current table counts (as of setup):
- Profiles: 17 records
- Races: 6 records
- Character Classes: 23 records

## Environment Variables

Add these to your `.env` file:

```bash
SUPABASE_DB_HOST=db.ckxcnnvcpitlqmmsekoy.supabase.co
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=Odmibr0737William
SUPABASE_DB_URL=https://ckxcnnvcpitlqmmsekoy.supabase.co
```

## Common Operations

### Backup Database
```bash
docker-compose exec pg-client pg_dump "postgresql://postgres.ckxcnnvcpitlqmmsekoy:Odmibr0737William@aws-0-eu-north-1.pooler.supabase.com:6543/postgres?sslmode=require" > backup.sql
```

### Import Data
```bash
docker-compose exec -T pg-client psql "postgresql://postgres.ckxcnnvcpitlqmmsekoy:Odmibr0737William@aws-0-eu-north-1.pooler.supabase.com:6543/postgres?sslmode=require" < import.sql
```

### Monitor Connections
```sql
SELECT * FROM pg_stat_activity;
```

## Best Practices

1. **Always use connection pooling** for:
   - Better resource management
   - Automatic connection handling
   - Improved performance

2. **Enable SSL Mode** for:
   - Encrypted connections
   - Data security
   - Compliance requirements

3. **Use environment variables** for:
   - Credentials
   - Connection strings
   - Configuration

4. **Regular backups** using:
   - pg_dump for data
   - Schema versioning
   - Migration tracking

## Support and Resources

- Supabase Dashboard: https://ckxcnnvcpitlqmmsekoy.supabase.co
- PostgreSQL Documentation: https://www.postgresql.org/docs/15/index.html
- Supabase Documentation: https://supabase.com/docs 