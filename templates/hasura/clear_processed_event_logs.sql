-- This will clear every processed event log in the database including
-- scheduled events, cron events, and action logs.

-- Affected: Event Triggers (Processed & Invocation Logs)
DELETE FROM hdb_catalog.event_invocation_logs;
DELETE FROM hdb_catalog.event_log WHERE delivered = true OR error = true;

-- Affected: CRON Events (Processed & Invocation Logs)
DELETE FROM hdb_catalog.hdb_cron_events
WHERE status IN ('delivered', 'error', 'dead');

-- Affected: Scheduled Events (Processed & Invocation Logs)
DELETE FROM hdb_catalog.hdb_scheduled_events
WHERE status IN ('delivered', 'error', 'dead');
