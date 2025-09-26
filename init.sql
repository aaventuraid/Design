-- Initial database setup for Yuki Yaki Corner
-- This script is run when PostgreSQL container starts for the first time

-- Create database if not exists (already handled by POSTGRES_DB env var)
-- CREATE DATABASE IF NOT EXISTS yuki_yaki_db;

-- Set timezone
SET timezone = 'Asia/Jakarta';

-- Enable UUID extension for CUID-like functionality
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant all privileges to the user
GRANT ALL PRIVILEGES ON DATABASE yuki_yaki_db TO yuki_user;

-- Log initialization
SELECT 'Database yuki_yaki_db initialized successfully' AS status;