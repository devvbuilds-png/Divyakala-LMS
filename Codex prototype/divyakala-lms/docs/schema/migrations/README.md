# Schema Migrations

Every change to the database schema is recorded here as a numbered SQL file:
`001-initial-schema.sql`, `002-add-batches-table.sql`, etc.

Rules:
- Never delete a migration. The folder is the full history.
- Every migration must also be reflected in `../current-schema.sql`.
- Migrations are forward-only. To undo, write a new migration.
- Name format: `NNN-short-description.sql`
