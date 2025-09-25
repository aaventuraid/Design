# PostgreSQL Setup Guide

**AI-Powered Content & Social Media Platform - Database Setup**

This project uses **PostgreSQL exclusively** for both development and production environments to ensure consistency and leverage PostgreSQL-specific features like native arrays.

---

## 🐘 **Local Development Setup**

### **Option 1: Docker (Recommended)**

1. **Create docker-compose.dev.yml:**

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: ai_platform_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql

volumes:
  postgres_data:
```

2. **Start PostgreSQL:**

```bash
docker-compose -f docker-compose.dev.yml up -d
```

3. **Verify connection:**

```bash
docker exec -it 2ai_postgres_1 psql -U postgres -d ai_platform_dev
```

### **Option 2: Native Installation**

**Windows:**

1. Download PostgreSQL from [official website](https://www.postgresql.org/download/windows/)
2. Install with default settings, remember the password
3. Create development database:

```sql
-- Connect as postgres user
CREATE DATABASE ai_platform_dev;
CREATE USER dev_user WITH PASSWORD 'dev_password';
GRANT ALL PRIVILEGES ON DATABASE ai_platform_dev TO dev_user;
```

**macOS (Homebrew):**

```bash
brew install postgresql
brew services start postgresql
createdb ai_platform_dev
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo -u postgres createdb ai_platform_dev
```

---

## 🔧 **Environment Configuration**

1. **Copy environment file:**

```bash
cp .env.example .env.local
```

2. **Update DATABASE_URL in .env.local:**

```bash
# For Docker setup:
DATABASE_URL="postgresql://postgres:password@localhost:5432/ai_platform_dev"

# For native setup:
DATABASE_URL="postgresql://dev_user:dev_password@localhost:5432/ai_platform_dev"
```

---

## 🏗️ **Database Setup**

1. **Reset and create migrations:**

```bash
# Remove old migrations (SQLite era)
rm -rf prisma/migrations

# Create new migration
npx prisma migrate dev --name init
```

2. **Seed database:**

```bash
npx prisma db seed
```

3. **Verify setup:**

```bash
npx prisma studio
```

---

## 🎯 **Key Features Using PostgreSQL**

### **Native Array Support**

```sql
-- Example: hashtags stored as PostgreSQL array
SELECT * FROM scheduled_contents WHERE 'food' = ANY(hashtags);
```

### **JSON Fields with Indexing**

```sql
-- Example: Query AI analysis results
SELECT * FROM food_images WHERE ai_analysis->>'confidence' > '0.9';
```

### **Platform Enum Arrays**

```sql
-- Example: Campaigns targeting multiple platforms
SELECT * FROM campaigns WHERE 'INSTAGRAM' = ANY(platforms);
```

---

## 🔍 **Useful Development Commands**

### **Database Management**

```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Push schema changes without migration
npx prisma db push

# View database in browser
npx prisma studio

# Generate client after schema changes
npx prisma generate
```

### **Data Inspection**

```bash
# Connect to database
psql postgresql://postgres:password@localhost:5432/ai_platform_dev

# Useful queries
\dt                          # List tables
\d+ users                    # Describe users table
SELECT * FROM campaigns;     # View campaigns
SELECT * FROM food_images;   # View food images
```

---

## 🚀 **Production Migration**

### **From SQLite (If Needed)**

If migrating from an existing SQLite database:

```bash
# Export existing data
npx prisma db pull
sqlite3 prisma/dev.db .dump > backup.sql

# Convert to PostgreSQL-compatible format
# (Manual conversion needed for data types)

# Import to PostgreSQL
psql -U postgres -d ai_platform_dev < converted_backup.sql
```

### **Deployment**

For Coolify/production deployment:

1. **Create production database**
2. **Set DATABASE_URL environment variable**
3. **Run migrations:**

```bash
npx prisma migrate deploy
npx prisma db seed
```

---

## 🛠️ **Troubleshooting**

### **Connection Issues**

```bash
# Test connection
pg_isready -h localhost -p 5432

# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list | grep postgres  # macOS
```

### **Permission Issues**

```sql
-- Grant necessary permissions
GRANT ALL ON SCHEMA public TO dev_user;
GRANT ALL ON ALL TABLES IN SCHEMA public TO dev_user;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO dev_user;
```

### **Port Conflicts**

If port 5432 is already in use:

```yaml
# In docker-compose.dev.yml, change ports:
ports:
  - "5433:5432"  # Use different host port

# Update DATABASE_URL accordingly:
DATABASE_URL="postgresql://postgres:password@localhost:5433/ai_platform_dev"
```

---

## 📊 **Performance Optimization**

### **Recommended Indexes**

The following indexes will be added via migrations:

```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- Campaign queries
CREATE INDEX idx_campaigns_user_status ON campaigns(user_id, status);
CREATE INDEX idx_campaigns_platforms ON campaigns USING GIN(platforms);

-- Content scheduling
CREATE INDEX idx_scheduled_contents_campaign_day ON scheduled_contents(campaign_id, day);
CREATE INDEX idx_scheduled_contents_platform_status ON scheduled_contents(platform, status);

-- Analytics queries
CREATE INDEX idx_campaign_analytics_campaign_date ON campaign_analytics(campaign_id, date);
```

### **Connection Pooling**

For production, consider connection pooling:

```bash
# Using PgBouncer
DATABASE_URL="postgresql://postgres:password@localhost:6543/ai_platform_dev?pgbouncer=true"
```

---

## 🎉 **Verification**

After setup, verify everything works:

1. **Database connection:** `npx prisma db pull`
2. **Seed data:** Check admin user exists via `npx prisma studio`
3. **Sample data:** Verify food images and campaigns exist
4. **API endpoints:** Test with development server

---

**🚀 Ready for PostgreSQL-powered AI platform development!**

Need help? Check the troubleshooting section or create an issue in the repository.
