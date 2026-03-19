#!/bin/bash

set -e

echo "Leave Management System - Backend Setup"
echo "========================================"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL is not installed. Please install PostgreSQL first."
    echo "Visit: https://www.postgresql.org/download/"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo ".env file created. Please update database credentials if needed."
fi

# Load environment variables
export $(cat .env | grep -v '#' | xargs)

# Check if database exists, if not create it
echo "Setting up PostgreSQL database..."

# Create database
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -c "CREATE DATABASE $DB_NAME;"

echo "Database '$DB_NAME' created/exists"

# Run migrations
echo "Running migrations..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f migrations/001_init.sql
echo "Schema initialized"

# Run seed data
echo "Seeding data..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f migrations/002_seed.sql
echo "Data seeded"

echo ""
echo "Setup complete!"
echo "Database: $DB_NAME"
echo "Host: $DB_HOST"
echo "Port: $DB_PORT"
echo ""
echo "To start the server, run: go run main.go"
