<!--
Sync Impact Report
- Version change: unversioned template → 1.0.0 (initial ratification)
- Modified principles: none (template placeholders replaced)
- Added sections: Core Principles I–V, Technical Constraints, Quality Gates, Governance
- Removed sections: none
- Follow-up TODOs: none. Product behavior is not invented here; add it with
  /speckit-specify when a feature description exists.
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

A change to tables, columns, indexes, constraints, triggers, or enums MUST
include a Drizzle SQL migration in the same change. `drizzle-kit push` and a
schema-only edit MUST NOT be the deploy path. The migration MUST be
idempotent (`IF NOT EXISTS` / `IF EXISTS`), MUST backfill existing rows before
`SET NOT NULL`, and MUST NOT rewrite an already-shipped `drizzle/*.sql` file.
A column that an earlier re-runnable migration still indexes MUST NOT be
dropped or renamed in a later migration. `npm run db:migrate` MUST be run
against the local database before the change is finished.

**Rationale**: Vercel runs `npm run db:migrate` before `next build` and
reapplies every `drizzle/*.sql` file. Non-idempotent or missing SQL breaks
that deploy.

### III. Queries Load Only Used Columns

Every database query MUST select only the columns the page or caller uses.
`select()` of a whole row MUST NOT be used when the response needs a subset.
A listing MUST load only the fields its cards render. A value derived from a
large column (reading time, search snippet) MUST be computed in SQL and
returned as that value alone. A detail page MAY load the columns that page
renders. A join key MAY be selected when the query needs it to assemble the
page and it is not returned to the client.

**Rationale**: Unbounded row loads pull unused large text into listings and
make later query cost unpredictable.

### IV. TypeScript Must Pass Lint

After any `.ts` or `.tsx` file is added or edited, lint MUST be run on those
files and MUST pass before the change is finished. A broad change MUST use
`npm run lint` (the same check as the Vercel `next build`). A reported lint
failure MUST be fixed and re-checked. A change MUST NOT be left in a state
that would fail deploy lint.

**Rationale**: Lint is the deploy gate. Leaving it red fails the Vercel build.

### V. Justified Complexity

Start with the smallest change that meets the spec. Extra services, new
datastores, or a second application boundary MUST be justified in the feature
plan. Duplicated domain rules MUST be extracted and reused. Files under
`node_modules` MUST NOT be modified.

**Rationale**: Unjustified structure is harder to review than the behavior it
wraps.

## Technical Constraints

- Application code is TypeScript on Next.js. Database access is Drizzle.
- Schema lives in `src/server/db/schema.ts`. Each migration is
  `drizzle/NNNN_short_name.sql` plus an entry in `drizzle/meta/_journal.json`.
  Seed or SQL inserts that name columns MUST be updated in the same change.
- Host deploy runs `npm run db:migrate` before `next build`.
- The active feature spec lives under `specs/<feature>/spec.md`.

## Quality Gates

A change is not done until:

1. Behavior changes have a matching update in the active feature spec.
2. Schema changes have an idempotent Drizzle SQL migration, a journal entry,
   and a successful local `npm run db:migrate`.
3. New or edited queries select only the columns the caller uses.
4. Lint passes for every added or edited `.ts` / `.tsx` file.

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

**Version**: 1.0.0 | **Ratified**: 2026-10-15 | **Last Amended**: 2026-10-15
