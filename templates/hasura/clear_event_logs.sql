-- Careful! This will clear every event log in the database including
-- scheduled events, cron events, and action logs. This is useful for
-- testing purposes, but should not be used in production.
DELETE FROM hdb_catalog.event_invocation_logs;

DELETE FROM hdb_catalog.event_log;

DELETE FROM hdb_catalog.hdb_action_log;

DELETE FROM hdb_catalog.hdb_cron_events;

DELETE FROM hdb_catalog.hdb_scheduled_events;