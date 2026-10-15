<!--
Sync Impact Report
- Version change: 1.0.0 → 2.0.0 (MAJOR: Principle IV redefined; technical
  constraints redefined from a Next.js application to a test project)
- Modified principles: IV. TypeScript Must Pass Lint (next lint / Vercel
  next build → npm run lint as tsc --noEmit). II and III now apply only if
  a database is introduced.
- Added sections: none
- Removed sections: none
- Follow-up TODOs: none
-->

# тестове_nuxgame Constitution

## Core Principles

### I. Spec Tracks Behavior

Every product, UX, or user-visible behavior change MUST update the active
feature spec in the same change, before the work is finished. The spec MUST
stay testable and stakeholder-facing: clarifications, user stories, acceptance
scenarios, and `FR-*` requirements. Success criteria, edge cases, and
assumptions MUST be updated only when the change affects them. A refactor,
formatting change, or internal-only fix with no behavior change MUST NOT
require a spec edit.

**Rationale**: The spec is the acceptance contract. Code that changes what a
visitor or operator can do without a spec update leaves the contract stale.

### II. Schema Changes Ship as Migrations

This repository is a test project and has no database. This principle applies
only if a later change introduces one. A change to tables, columns, indexes,
constraints, triggers, or enums MUST then include a Drizzle SQL migration in
the same change. `drizzle-kit push` and a schema-only edit MUST NOT be the
deploy path. The migration MUST be idempotent (`IF NOT EXISTS` / `IF EXISTS`),
MUST backfill existing rows before `SET NOT NULL`, and MUST NOT rewrite an
already-shipped `drizzle/*.sql` file. A column that an earlier re-runnable
migration still indexes MUST NOT be dropped or renamed in a later migration.
`npm run db:migrate` MUST be run against the local database before the change
is finished.

**Rationale**: There is nothing to migrate until a database exists. If one is
added, shipped SQL must stay safe to reapply.

### III. Queries Load Only Used Columns

This repository has no database queries. This principle applies only if a
later change adds them. Every database query MUST then select only the columns
the caller uses. `select()` of a whole row MUST NOT be used when the response
needs a subset. A value derived from a large column MUST be computed in SQL
and returned as that value alone.

**Rationale**: Unbounded row loads pull unused data. The rule waits until a
query exists.

### IV. TypeScript Must Pass Lint

After any `.ts` or `.tsx` file is added or edited, `npm run lint` MUST be run
and MUST pass before the change is finished. `npm run lint` MUST run
`tsc --noEmit`. `next lint` MUST NOT be required. A reported failure MUST be
fixed and re-checked.

**Rationale**: This is a test project, not a Next.js application. Typecheck
is the lint gate.

### V. Justified Complexity

Start with the smallest change that meets the spec. Extra services, a
database, or an application boundary MUST be justified in the feature plan.
Duplicated domain rules MUST be extracted and reused. Files under
`node_modules` MUST NOT be modified.

**Rationale**: Unjustified structure is harder to review than the behavior it
wraps.

## Technical Constraints

- This repository is a test project, not an application. It has no Next.js
  app and no Drizzle database.
- Test code is TypeScript, run with Playwright.
- `npm run lint` is `tsc --noEmit`.
- Account credentials MUST be read from environment variables. They MUST NOT
  be written into source files or the project description.
- The active feature spec lives under `specs/<feature>/spec.md`.

## Quality Gates

A change is not done until:

1. Behavior changes have a matching update in the active feature spec.
2. If a database schema change is introduced, it has an idempotent Drizzle
   SQL migration, a journal entry, and a successful local `npm run db:migrate`.
3. If a database query is added or edited, it selects only the columns the
   caller uses.
4. `npm run lint` (`tsc --noEmit`) passes for every added or edited `.ts` /
   `.tsx` file.

Code review MUST check these gates. `/speckit-plan` and `/speckit-analyze`
MUST treat the principles above as MUST gates.

## Governance

This constitution supersedes informal practice and the Spec Kit placeholder
template. Amendments MUST update this file, bump **Version** (MAJOR: remove or
redefine a principle; MINOR: add a principle or section; PATCH: wording only),
set **Last Amended** to the change date, and record the reason in the Sync
Impact Report comment at the top. That report is scratch for review and MUST
be removed before the amended file is committed. Feature specs and tasks MUST
be adjusted to comply. Principles MUST NOT be silently ignored.

**Version**: 2.0.0 | **Ratified**: 2026-10-15 | **Last Amended**: 2026-10-15
