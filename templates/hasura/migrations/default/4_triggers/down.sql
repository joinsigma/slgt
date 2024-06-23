/* 
  This file contains the SQL statements that are to be run when the migration is rolled back.
  Be careful, this can't be recovered.

  Note: This file should only contain SQL that undoes the changes made in "up.sql".

  Command: hasura migrate apply --down --version 4
*/

/* 
Before Update Trigger:
    - set_public_<table_name>_updated_at: sets the value of the "updated_at" column to the current timestamp on row update
 */
DO $$
DECLARE v_table record;
DECLARE v_sql text;
BEGIN
    FOR v_table IN 
        SELECT *
        FROM information_schema.tables
        WHERE 
            table_schema = 'public'
            AND table_type <> 'VIEW'
            AND table_name <> 'profiles' -- supabase default table
    LOOP 
        v_sql := format (
        '
            DROP TRIGGER set_%s_%s_updated_at 
            ON %s.%s;
        ',
            v_table.table_schema,
            v_table.table_name,
            v_table.table_schema,
            v_table.table_name
        );
        EXECUTE v_sql;
    END LOOP;
END;
$$;

DROP TRIGGER on_auth_user_created ON auth.users;
DROP TRIGGER on_public_profile_updated ON public.profiles;
-- Add more if needed. 
-- Do make sure to drop them in the reverse order they were created.