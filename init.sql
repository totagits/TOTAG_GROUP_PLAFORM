-- Initialize TOTAG Group Database
-- This script creates the necessary database schema for production deployment

-- Create database if it doesn't exist
SELECT 'CREATE DATABASE totaggroup' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'totaggroup')\gexec

-- Connect to the database
\c totaggroup;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create tables (these will be managed by Drizzle ORM)
-- The application will create tables automatically on first run
-- This file is mainly for initial database setup

-- Create a simple health check table
CREATE TABLE IF NOT EXISTS deployment_info (
    id SERIAL PRIMARY KEY,
    deployment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version VARCHAR(50) DEFAULT '1.0.0',
    status VARCHAR(20) DEFAULT 'active'
);

-- Insert deployment record
INSERT INTO deployment_info (deployment_date, version, status) 
VALUES (CURRENT_TIMESTAMP, '1.0.0', 'active')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
-- These will be created by the application, but we can prepare some basic ones

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE totaggroup TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;