/* 
  This file contains the SQL statements that are to be run when the migration is applied.
  To revert the changes, see down.sql.

  Note: This file should only contain SQL that relates to creating the function(s).

  Command: hasura migrate apply --up --version 3
*/

/* 
Functions:
    - lowercase_and_replace_spaces: converts a string to lowercase and replaces spaces with underscores
    - handle_new_user: upsert new user metadata into profiles table when a new user is created in auth.users
    - sync_user_metadata: sync user metadata from profiles table to auth.users when user metadata is updated
*/
CREATE OR REPLACE FUNCTION public.lowercase_and_replace_spaces(v_string TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN LOWER(REPLACE(v_string, ' ', '_'));
END;
$$ LANGUAGE PLPGSQL STABLE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
      id, 
      user_metadata
    )
    VALUES (
      NEW.id, 
      NEW.raw_user_meta_data
    )
    ON CONFLICT (id) DO UPDATE SET
      user_metadata = EXCLUDED.user_metadata;

    RETURN NEW;
END;
$$ LANGUAGE PLPGSQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.sync_user_metadata()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE auth.users 
      SET raw_user_meta_data = NEW.user_metadata
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE PLPGSQL SECURITY DEFINER;
-- Add more if needed