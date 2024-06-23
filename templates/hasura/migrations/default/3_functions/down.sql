/* 
  This file contains the SQL statements that are to be run when the migration is rolled back.
  Be careful, this can't be recovered.

  Note: This file should only contain SQL that undoes the changes made in "up.sql".

  Command: hasura migrate apply --down --version 3
*/
DROP FUNCTION public.lowercase_and_replace_spaces(v_string TEXT);
DROP FUNCTION public.handle_new_user();
DROP FUNCTION public.sync_user_metadata();
-- Add more if needed. 
-- Do make sure to drop them in the reverse order they were created.