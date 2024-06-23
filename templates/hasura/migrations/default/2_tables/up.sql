/* 
  This file contains the SQL statements that are to be run when the migration is applied.
  To revert the changes, see down.sql.

  Note: This file should only contain SQL that relates to creating the table(s).

  Command: hasura migrate apply --up --version 2
*/

/* 
Tables:
    - profiles: Table to store user profiles from auth.users. This is just a sample. You can modify this as per your requirements.
*/
CREATE TABLE public.profiles (
    id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    user_metadata JSONB,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Add more if needed