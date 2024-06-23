/* 
  This file contains the SQL statements that are to be run when the migration is applied.
  To revert the changes, see down.sql.

  Note: This file should only contain SQL that relates to creating the trigger(s).

  Command: hasura migrate apply --up --version 4
*/

/* 
Before Update Trigger:
    - set_public_<table_name>_updated_at: sets the value of the "updated_at" column to the current timestamp on row update
    - on_auth_user_created: upsert new user metadata into profiles table when a new user is created in auth.users
    - on_public_profile_updated: sync user metadata from profiles table to auth.users when user metadata is updated
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
    LOOP 
        v_sql := format (
        '
            CREATE OR REPLACE TRIGGER set_%s_%s_updated_at 
            BEFORE UPDATE ON %s.%s 
            FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
            COMMENT ON TRIGGER set_%s_%s_updated_at ON %s.%s IS %s;
        ',
            v_table.table_schema,
            v_table.table_name,
            v_table.table_schema,
            v_table.table_name,
            v_table.table_schema,
            v_table.table_name,
            v_table.table_schema,
            v_table.table_name,
            '''trigger to set value of column "updated_at" to current timestamp on row update'''
        );
        EXECUTE v_sql;
    END LOOP;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE TRIGGER on_public_profile_updated
AFTER UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.sync_user_metadata();

-- Add more if needed