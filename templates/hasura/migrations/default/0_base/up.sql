/* 
  This file contains the SQL statements that are to be run when the migration is applied.
  To revert the changes, see down.sql.

  Note: This file should only contain SQL that creates the initial state of the database.

  Command: hasura migrate apply --up --version 0
*/

-- Set the default timezone to UTC
SET TIMEZONE='etc/UTC';

/* 
Schemas:
  - public: default schema. Use for tables that are shared across all tenants
*/
CREATE SCHEMA IF NOT EXISTS public;

/*
Functions:
  - set_current_timestamp_updated_at: sets the updated_at column to the current timestamp
*/
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;

-- Add more if needed