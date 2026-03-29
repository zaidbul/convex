import { and, eq, sql } from "drizzle-orm"
import type { LibSQLDatabase } from "drizzle-orm/libsql"
import * as schema from "@/db/schema"
import type { ViewerContext } from "./tickets-data"

type SeedDatabase = LibSQLDatabase<typeof schema>

interface SeedIssue {
  title: string
  description: string
  status: "backlog" | "todo" | "in-progress" | "in-review" | "done" | "cancelled"
  priority: "urgent" | "high" | "medium" | "low" | "none"
  labelNames: string[]
  cycleIndex: number
}

const priorityScoreMap: Record<string, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
  none: 0,
}

const CYCLE_DEFINITIONS = [
  {
    name: "Regulatory Compliance & Data Integrity",
    status: "completed" as const,
    startDate: "2026-01-05",
    endDate: "2026-02-06",
  },
  {
    name: "Patient Safety & Monitoring",
    status: "active" as const,
    startDate: "2026-02-09",
    endDate: "2026-03-13",
  },
  {
    name: "Reporting & Analytics",
    status: "upcoming" as const,
    startDate: "2026-03-16",
    endDate: "2026-04-17",
  },
]

const LABEL_DEFINITIONS: { name: string; color: string }[] = [
  { name: "Bug", color: "#ef4444" },
  { name: "Feature", color: "#3b82f6" },
  { name: "Enhancement", color: "#8b5cf6" },
  { name: "Security", color: "#f59e0b" },
  { name: "Performance", color: "#10b981" },
  { name: "Documentation", color: "#6b7280" },
  { name: "UX", color: "#ec4899" },
  { name: "Infrastructure", color: "#06b6d4" },
  { name: "Compliance", color: "#f97316" },
  { name: "Data Migration", color: "#14b8a6" },
]

const SEED_ISSUES: SeedIssue[] = [
  {
    title: "Enforce 21 CFR Part 11 compliant electronic signatures on eCRF submissions",
    description: `## Problem Statement

Our Electronic Data Capture (EDC) system currently allows clinical research coordinators (CRCs) to submit completed electronic Case Report Forms (eCRFs) without a fully 21 CFR Part 11 compliant electronic signature workflow. The FDA requires that electronic records used in clinical trials meet specific criteria for electronic signatures, including manifestation of signing intent, signature meaning, and binding of the signature to the record. Our current implementation uses a simple password confirmation dialog, which does not satisfy the regulatory requirement for a legally binding signature that includes the printed name, date/time, and meaning (e.g., "authorship", "review", "approval") of the signing.

## Expected Behavior vs Current Behavior

**Current:** Users click "Submit" on an eCRF page, enter their password, and the form is marked as submitted. No audit trail entry captures the signature meaning, and the signature metadata is not cryptographically bound to the form data snapshot.

**Expected:** Upon submission, users are presented with a signature modal that displays: (1) their full name and title, (2) the date and time in the site's local timezone and UTC, (3) a dropdown to select the signature meaning (authorship, review, informed approval, responsibility), (4) a legal attestation statement, and (5) a password + optional MFA confirmation. The signature must be cryptographically hashed with the form data to prevent post-signature tampering.

## Acceptance Criteria

- [ ] Signature modal displays signer's full name, title, organization, date/time (local + UTC)
- [ ] Signature meaning is selectable from a configurable list per form type
- [ ] Legal attestation text is configurable per sponsor/study
- [ ] Password re-authentication is required; MFA prompt shown if user has MFA enabled
- [ ] SHA-256 hash of form data at time of signing is stored alongside signature record
- [ ] Audit trail entry created with all signature metadata, IP address, and user agent
- [ ] Signature cannot be applied if any required fields on the eCRF have open queries
- [ ] Unit tests cover all signature validation paths including expired sessions

## Technical Notes

The signature record should be stored in a dedicated \`e_signatures\` table with FK to \`ecrf_submissions\`. Use the existing \`crypto\` service for SHA-256 hashing. The signature modal component should be a shared UI component since it will be reused for other signing workflows (protocol deviations, monitoring reports). Consider using a Web Crypto API polyfill for older browser support at sites.

## Edge Cases

- User's session expires between opening the signature modal and confirming — must re-authenticate fully
- Concurrent edit: another user modifies a shared form section after hash is computed but before signature is stored
- Network interruption during signature submission — must not result in a partial signature record
- User account is deactivated between opening the modal and submitting the signature`,
    status: "done",
    priority: "urgent",
    labelNames: ["Compliance", "Security"],
    cycleIndex: 0,
  },
  {
    title: "Implement complete audit trail for all eCRF data modifications",
    description: `## Problem Statement

Per ICH-GCP E6(R2) guidelines and 21 CFR Part 11 requirements, every modification to clinical trial data must be tracked with a secure, computer-generated, time-stamped audit trail. Our current audit trail implementation has gaps: it does not capture the reason for change on certain field types (multi-select dropdowns, repeating form groups), and the audit log viewer in the UI does not display the complete before/after state for complex data structures like lab panels and concomitant medication tables.

## Expected Behavior vs Current Behavior

**Current:** Simple text and numeric fields generate proper audit entries with old value, new value, timestamp, user, and reason for change. However, repeating form groups (e.g., adding/removing rows in an AE log) only log that a "row was modified" without field-level granularity. Multi-select fields log only the final state, not which options were added or removed.

**Expected:** Every atomic data change, regardless of field type, produces a discrete audit trail entry with: field OID, old value, new value, change reason (when required by form configuration), user ID, timestamp (UTC), and transaction ID for grouping related changes. The audit log viewer must render these entries in a human-readable format with expandable detail for complex changes.

## Acceptance Criteria

- [ ] Repeating form group modifications generate field-level audit entries for each changed cell
- [ ] Multi-select fields log individual additions and removals as separate entries
- [ ] Audit entries include transaction IDs to group changes made in a single save operation
- [ ] Reason for change is enforced when configured at the field or form level
- [ ] Audit log viewer supports filtering by date range, user, field, and change type
- [ ] Audit trail export to CSV/PDF includes all metadata fields
- [ ] Audit records are immutable — no UPDATE or DELETE operations permitted on audit tables
- [ ] Performance: audit log page loads within 2 seconds for forms with up to 10,000 entries

## Technical Notes

The audit trail system uses PostgreSQL with append-only tables. Consider partitioning the \`audit_entries\` table by study and month for query performance. The diff computation for repeating groups should happen server-side before persistence to ensure consistency. Use database triggers as a safety net in addition to application-level audit logging.

## Edge Cases

- Bulk import of lab data via CSV should generate individual audit entries per field, not a single "bulk import" entry
- System-generated changes (e.g., auto-calculated BMI from height/weight) must be attributed to "SYSTEM" user with reference to the triggering user action
- Timezone handling: all audit timestamps must be stored in UTC; display conversion happens in the UI layer
- Data migration from legacy system: migrated records should have a special audit entry type "MIGRATION" with reference to source system`,
    status: "done",
    priority: "high",
    labelNames: ["Compliance", "Feature"],
    cycleIndex: 0,
  },
  {
    title: "Add CDISC SDTM validation rules to data export pipeline",
    description: `## Problem Statement

When sponsors submit clinical trial data to the FDA, it must conform to CDISC Study Data Tabulation Model (SDTM) standards. Our data export pipeline currently generates SDTM datasets from eCRF data but does not validate them against the SDTM Implementation Guide (IG) v3.4 or the FDA's published validation rules (Pinnacle 21 / P21 Community rules). This means sponsors discover validation errors only after running third-party tools on the exported datasets, often requiring multiple round-trips to fix mapping issues.

## Expected Behavior vs Current Behavior

**Current:** The export pipeline maps eCRF fields to SDTM domains (DM, AE, CM, LB, VS, etc.) based on study-specific configuration and generates SAS transport (XPT) files. No validation is performed during or after generation.

**Expected:** After dataset generation, the pipeline should execute a configurable set of CDISC validation rules that check: (1) controlled terminology compliance (using CDISC CT packages), (2) variable-level metadata conformance (data types, lengths, labels), (3) domain-level consistency rules (e.g., AESTDTC must be on or after RFSTDTC in DM), and (4) cross-domain referential integrity (e.g., USUBJID consistency across all domains). Validation results should be presented in a report with severity levels (Error, Warning, Notice) and direct links to the source eCRF fields.

## Acceptance Criteria

- [ ] Validation engine supports loading CDISC CT packages (configurable per study)
- [ ] At least 200 core SDTM validation rules implemented covering DM, AE, CM, LB, VS, EX, and DS domains
- [ ] Validation report includes rule ID, severity, affected records (USUBJID + domain + sequence), message, and source eCRF link
- [ ] Validation can be run independently of export (dry-run mode)
- [ ] Rules are version-controlled and configurable per study/sponsor
- [ ] Export is blocked when critical (Error-level) validation failures exist, unless overridden by a Data Manager with documented justification
- [ ] Performance: validation of a 500-patient study completes within 5 minutes
- [ ] Validation results are persisted and viewable in the study dashboard

## Technical Notes

Consider building the validation engine as a separate microservice that accepts SDTM datasets via an internal API. This allows it to be reused for ADaM validation in the future. The rule definitions should be stored in a structured format (YAML or JSON) that maps to the Pinnacle 21 rule taxonomy. Use parallel processing for cross-domain checks to meet the performance requirement.

## Edge Cases

- Studies using SDTM IG versions older than 3.4 should use version-appropriate rule sets
- Supplemental qualifier datasets (SUPPAE, SUPPCM, etc.) need their own validation rules
- Custom domains (not in the SDTM standard) should be validated against the study's annotated CRF
- Partial exports (single-domain re-export) should still trigger cross-domain referential integrity checks against the last full export snapshot`,
    status: "done",
    priority: "high",
    labelNames: ["Compliance", "Feature"],
    cycleIndex: 0,
  },
  {
    title: "Fix data integrity issue where concurrent eCRF saves overwrite changes silently",
    description: `## Problem Statement

A critical data integrity bug has been identified where two users editing the same eCRF form simultaneously can cause one user's changes to be silently overwritten. This was discovered during a sponsor audit at a high-enrollment oncology site where a CRC and a data manager were both editing a subject's Adverse Event form. The CRC's updates to AE severity and outcome were lost when the data manager saved their query resolution changes moments later. This constitutes a GCP violation as clinical data was lost without an audit trail entry.

## Expected Behavior vs Current Behavior

**Current:** When a user loads an eCRF, the form data is fetched from the server. Upon save, the entire form payload is sent back, overwriting whatever is in the database. There is no optimistic concurrency control or conflict detection. The last save wins.

**Expected:** The system must implement optimistic concurrency control using version vectors or ETags. When a save request arrives, the server compares the version of the data the client is working with against the current version in the database. If they differ, the save is rejected with a 409 Conflict response, and the user is shown a merge/conflict resolution UI that displays both sets of changes, allowing them to reconcile before re-submitting.

## Acceptance Criteria

- [ ] Each eCRF form instance has a version counter that increments on every successful save
- [ ] Save requests include the expected version; mismatches return HTTP 409
- [ ] Conflict resolution UI shows field-by-field diff between local changes and server state
- [ ] User can accept server version, keep local version, or manually merge per field
- [ ] Merged save creates audit trail entries for all resolved conflicts
- [ ] Real-time presence indicators show which users are currently viewing/editing a form
- [ ] Auto-save draft functionality preserves unsaved work client-side (IndexedDB)
- [ ] Load testing confirms no data loss under 50 concurrent users editing different forms on the same subject

## Technical Notes

Add a \`version\` BIGINT column to \`ecrf_form_instances\`. Use database-level \`UPDATE ... WHERE version = expected_version\` to implement atomic compare-and-swap. The conflict resolution UI should reuse the existing form renderer in read-only diff mode. Consider WebSocket or SSE for real-time presence. IndexedDB draft storage should be encrypted at rest and cleared after successful save.

## Edge Cases

- User goes offline mid-edit, comes back online, and tries to save stale data
- Auto-save draft conflicts with another user's completed save
- Three or more users editing the same form simultaneously — each needs to see the latest state after each conflict resolution
- System-initiated changes (edit checks, auto-calculations) should not trigger user-facing conflicts but must participate in version control`,
    status: "done",
    priority: "urgent",
    labelNames: ["Bug", "Data Migration"],
    cycleIndex: 0,
  },
  {
    title: "Implement role-based access control aligned with ICH-GCP delegation log",
    description: `## Problem Statement

ICH-GCP guidelines require that clinical trial tasks are delegated to qualified individuals via a delegation of authority log. Our current RBAC implementation uses a flat role model (Admin, Data Manager, CRC, Monitor, Read-Only) that does not map to the granular delegation structure required by sponsors. For example, a CRC might be delegated to perform informed consent but not drug accountability, yet our system grants uniform eCRF access to all CRCs at a site.

## Expected Behavior vs Current Behavior

**Current:** Users are assigned one of five global roles. Permissions are binary: a CRC can access all eCRF forms for subjects at their assigned site(s). There is no way to restrict access to specific form types or study activities.

**Expected:** The access control system should support: (1) role-based permissions as a baseline, (2) per-study permission overrides that map to delegation log entries, (3) form-level and section-level access control (view, edit, sign), (4) temporal access — permissions can have start/end dates matching delegation period, and (5) automatic access revocation when a delegation log entry is deactivated.

## Acceptance Criteria

- [ ] Permission model supports study-level, site-level, form-level, and section-level granularity
- [ ] Delegation log entries in the system map 1:1 to permission grants
- [ ] Temporal permissions: access auto-activates and auto-deactivates based on delegation dates
- [ ] Permission changes are audit-trailed with before/after state and reason
- [ ] Sponsors can define custom role templates per protocol
- [ ] System generates a Delegation-to-Access reconciliation report
- [ ] Performance: permission checks add less than 50ms to page load time
- [ ] Backward-compatible: existing role assignments are preserved during migration

## Technical Notes

Recommend implementing an attribute-based access control (ABAC) layer on top of the existing RBAC. Use a policy engine (e.g., Open Policy Agent or a custom rule engine) that evaluates access decisions based on user attributes, resource attributes, and delegation context. Cache permission decisions aggressively — invalidate on delegation log changes.

## Edge Cases

- Mid-visit delegation change: user loses access to a form they currently have open
- Emergency unblinding: certain users need temporary elevated access outside normal delegation
- Multi-site users: different delegation at each site for the same study
- PI oversight: Principal Investigator must always retain read access to all data at their site regardless of specific delegation entries`,
    status: "done",
    priority: "high",
    labelNames: ["Security", "Compliance"],
    cycleIndex: 0,
  },
  {
    title: "Migrate legacy database columns to use consistent UTC timestamps",
    description: `## Problem Statement

Historical development decisions led to inconsistent timestamp storage across our database schema. Some tables store timestamps in UTC (the correct approach for a global clinical trial system), while others store them in the application server's local timezone (US Eastern), and a few store them without any timezone information at all. This causes incorrect date displays for sites in different timezones and has led to at least three data queries from monitors who noticed that AE onset times appeared to shift when viewed from different locations.

## Expected Behavior vs Current Behavior

**Current:** The \`ecrf_data\`, \`audit_entries\`, and \`users\` tables use \`TIMESTAMP WITH TIME ZONE\` (correct). The \`adverse_events\`, \`protocol_deviations\`, \`site_monitoring_visits\`, and \`randomization_log\` tables use \`TIMESTAMP WITHOUT TIME ZONE\` and store values in US Eastern time.

**Expected:** All timestamp columns across all tables should use \`TIMESTAMP WITH TIME ZONE\` and store values in UTC. Application-layer conversion handles display in the user's local timezone. All existing data must be migrated correctly, accounting for daylight saving time transitions in the source data.

## Acceptance Criteria

- [ ] All timestamp columns converted to \`TIMESTAMP WITH TIME ZONE\`
- [ ] Existing data migrated from US Eastern to UTC with correct DST handling
- [ ] Migration script is idempotent and can be re-run safely
- [ ] Migration includes validation step that compares row counts and spot-checks known records
- [ ] Application code updated to remove any manual timezone conversion logic
- [ ] API responses consistently return ISO 8601 timestamps with UTC offset
- [ ] UI date/time displays converted to user's local timezone via browser API
- [ ] Rollback script available that can revert the migration within 30 minutes

## Technical Notes

Use a phased migration approach: (1) add new TZ-aware columns, (2) backfill with converted data, (3) swap column names in a single transaction, (4) drop old columns after validation period. Pay special attention to the DST transition dates (March/November).

## Edge Cases

- Timestamps during DST transitions (2:00 AM - 3:00 AM Eastern in March/November)
- Records with NULL timestamps must remain NULL after migration
- Foreign systems that push data via API may need updated documentation for the new format
- Scheduled jobs that reference specific times need their schedules updated to UTC`,
    status: "done",
    priority: "medium",
    labelNames: ["Data Migration", "Infrastructure"],
    cycleIndex: 0,
  },
  {
    title: "Add database-level encryption for PII/PHI fields in subject records",
    description: `## Problem Statement

While our application enforces access controls at the API layer, Protected Health Information (PHI) and Personally Identifiable Information (PII) in the database are stored in plaintext. This poses a risk if the database is compromised through a SQL injection vulnerability, a backup tape is lost, or a cloud storage misconfiguration exposes database snapshots. HIPAA, GDPR, and several sponsor security questionnaires require encryption at rest for PHI/PII beyond what full-disk encryption provides.

## Expected Behavior vs Current Behavior

**Current:** Fields such as subject name, date of birth, medical record number, phone number, email, and address are stored as plaintext VARCHAR/TEXT columns. Full-disk encryption (AWS EBS encryption) is enabled, but this does not protect against authorized database access by non-clinical personnel.

**Expected:** All PHI/PII fields are encrypted at the application level before storage using AES-256-GCM. Encryption keys are managed via AWS KMS with key rotation every 90 days. Decryption occurs at the application layer only when an authorized user requests the data.

## Acceptance Criteria

- [ ] All PHI/PII columns identified and catalogued across all tables
- [ ] AES-256-GCM encryption implemented at the application layer
- [ ] AWS KMS integration for key management with 90-day rotation policy
- [ ] Blind index columns created for fields that require exact-match search (e.g., MRN, email)
- [ ] Existing plaintext data migrated to encrypted format
- [ ] Old plaintext columns securely zeroed and dropped after migration validation
- [ ] Performance regression test: API response times increase by less than 100ms
- [ ] Emergency break-glass procedure documented for key compromise scenarios

## Technical Notes

Use envelope encryption: KMS encrypts a data encryption key (DEK) that is cached in memory. Blind indexes use HMAC-SHA256 with a separate key from the encryption key.

## Edge Cases

- Key rotation must re-encrypt existing data with the new key without downtime
- Subjects who withdraw consent may require permanent deletion (crypto-shredding) — deleting the subject's individual DEK
- Full-text search on encrypted fields is not possible — document this limitation
- Database backups made before encryption contain plaintext PHI — these must be identified and securely destroyed per retention policy`,
    status: "done",
    priority: "low",
    labelNames: ["Security", "Compliance"],
    cycleIndex: 0,
  },
  {
    title: "Implement automated protocol deviation detection from eCRF data",
    description: `## Problem Statement

Protocol deviations — instances where the clinical trial protocol was not followed — are currently identified manually by Clinical Research Associates (CRAs) during site monitoring visits. This is error-prone and means deviations are often discovered weeks or months after they occur. Many common deviations are algorithmically detectable from eCRF data: visit window violations, inclusion/exclusion criteria breaches discovered post-enrollment, dosing outside the permitted range, and missed required assessments.

## Expected Behavior vs Current Behavior

**Current:** CRAs manually review source documents and eCRF data during monitoring visits to identify deviations. They log deviations in a separate tracking system (Excel or a third-party tool) that is not integrated with our CTMS.

**Expected:** The system should continuously evaluate eCRF data against configurable protocol rules and flag potential deviations in real-time. Detected deviations should appear in a dedicated dashboard with severity classification (Important, Minor), affected subject/visit, deviation category, and supporting data.

## Acceptance Criteria

- [ ] Rule engine supports configurable deviation detection rules per protocol
- [ ] At minimum 10 standard deviation rule templates provided
- [ ] Real-time evaluation triggered on eCRF data save
- [ ] Deviation dashboard with filtering, sorting, and bulk operations
- [ ] CRA review workflow: confirm, dismiss (with reason), or escalate
- [ ] Confirmed deviations auto-populate the protocol deviation log eCRF
- [ ] Integration with RBQM risk indicators (deviation rate per site)
- [ ] Email/in-app notifications for high-severity deviations

## Technical Notes

The rule engine should be event-driven, triggered by data change events from the eCRF save pipeline. Rules should be defined in a DSL that clinical programmers can author without code deployments. Store rule definitions in the database alongside protocol version — rules may change with protocol amendments.

## Edge Cases

- Protocol amendment changes a visit window — existing deviation flags for the old window should be re-evaluated
- Retroactive data entry: deviation detected on data entered weeks after the visit
- Site uses a waiver/exemption for a specific deviation category
- Multiple deviations from a single data point`,
    status: "cancelled",
    priority: "low",
    labelNames: ["Feature", "Compliance"],
    cycleIndex: 0,
  },
  {
    title: "Build data reconciliation engine for external lab data imports",
    description: `## Problem Statement

Clinical trials routinely receive laboratory data from central labs (e.g., Covance, Q² Solutions) via automated data transfers. These lab results must be reconciled with eCRF lab data entered by sites to ensure consistency. Currently, this reconciliation is performed manually by data managers using Excel pivot tables, which is time-consuming (estimated 4-6 hours per data transfer for a 200-site study) and error-prone.

## Expected Behavior vs Current Behavior

**Current:** Central lab data is imported into a staging table. Data managers manually query the staging table and the eCRF lab data, export both to Excel, and use VLOOKUP formulas to find discrepancies.

**Expected:** An automated reconciliation engine compares incoming central lab data against eCRF lab data by matching on subject ID, visit, assessment date, and lab test code. Discrepancies are categorized and presented in a reconciliation dashboard with bulk query generation.

## Acceptance Criteria

- [ ] Automated matching on USUBJID, visit number, collection date, and LBTESTCD
- [ ] Configurable tolerance thresholds for numeric value comparisons
- [ ] Discrepancy dashboard with categorization, filtering, and export
- [ ] Bulk query generation from selected discrepancies
- [ ] Support for multiple lab vendors per study with vendor-specific mapping configurations
- [ ] Reconciliation history with audit trail
- [ ] Scheduled automatic reconciliation after each data transfer
- [ ] Summary statistics: reconciliation rate, discrepancy rate by site, by lab test

## Technical Notes

The reconciliation engine should be implemented as an async job processor since large studies can have millions of lab records. Use a configurable mapping layer to normalize vendor-specific lab test codes to LOINC or sponsor-defined dictionaries. Handle common data quality issues: leading/trailing whitespace, different date formats, and unit conversions.

## Edge Cases

- Same lab test performed multiple times on the same visit date — handle duplicate matching
- Lab test code mapping changes mid-study due to vendor switch
- Unscheduled visits that don't match expected visit numbers
- Partial lab panels where only some tests were performed centrally vs. locally`,
    status: "cancelled",
    priority: "none",
    labelNames: ["Feature", "Data Migration"],
    cycleIndex: 0,
  },
  {
    title: "Upgrade password policy to meet updated 21 CFR Part 11 guidance",
    description: `## Problem Statement

The FDA's updated guidance on 21 CFR Part 11 compliance emphasizes stronger authentication controls for electronic record systems. Our current password policy (minimum 8 characters, one uppercase, one number) falls below the NIST 800-63B guidelines that the FDA now references. Additionally, we do not enforce password expiration appropriate for clinical systems, and our account lockout policy does not align with the more stringent requirements in recent sponsor security questionnaires.

## Expected Behavior vs Current Behavior

**Current:** Minimum 8 characters with basic complexity (1 uppercase, 1 digit). Passwords expire every 180 days. Account locks after 5 failed attempts for 15 minutes. No breached password checking. No password history enforcement.

**Expected:** Minimum 12 characters with no arbitrary complexity rules (per NIST 800-63B — length over complexity). Check against a breached password database (Have I Been Pwned API or equivalent). Enforce password history (last 24 passwords cannot be reused). Account locks after 3 failed attempts and requires administrator unlock or identity verification. Configurable per-sponsor password policies.

## Acceptance Criteria

- [ ] Minimum password length increased to 12 characters (configurable up to 128)
- [ ] Breached password check via k-Anonymity API (HIBP) on password creation and change
- [ ] Password history stores last 24 hashed passwords; reuse is blocked
- [ ] Account lockout after 3 failed attempts; unlock requires admin action or identity verification
- [ ] Failed login attempts logged with IP address and timestamp for security review
- [ ] Password policy is configurable per sponsor/study with a system-wide minimum floor
- [ ] Existing users prompted to update passwords on next login if non-compliant
- [ ] Session timeout configurable per study (default 30 minutes of inactivity)

## Technical Notes

Use the HIBP k-Anonymity API to check passwords without sending the full hash to an external service. Store password history using bcrypt hashes in a \`password_history\` table. The configurable policy engine should be evaluated both client-side (for real-time feedback) and server-side (for enforcement).

## Edge Cases

- HIBP API is unavailable — should not block password creation; log the failure and retry asynchronously
- User has an extremely old account with a password set before history tracking began
- Admin unlock of a locked account should itself require MFA
- Service accounts used for API integrations should have separate credential policies`,
    status: "in-review",
    priority: "medium",
    labelNames: ["Security", "Compliance"],
    cycleIndex: 0,
  },
  // --- Cycle 2: Patient Safety & Monitoring ---
  {
    title: "Build real-time Adverse Event severity auto-grading engine using CTCAE v5.0",
    description: `## Problem Statement

Adverse Event (AE) grading in oncology trials follows the Common Terminology Criteria for Adverse Events (CTCAE) v5.0 scale, which classifies AEs from Grade 1 (mild) to Grade 5 (death). Currently, investigators manually select the grade when entering AEs into the eCRF, leading to inconsistencies across sites — internal audits have found a 12% discrepancy rate where the selected grade does not match the grading criteria based on the reported symptoms and lab values.

## Expected Behavior vs Current Behavior

**Current:** Investigators select an AE term (mapped to MedDRA) and manually choose a grade from a dropdown (1-5). No validation is performed against the CTCAE grading definitions.

**Expected:** When an investigator enters an AE term, the system should present the CTCAE v5.0 grading criteria for that specific term. Based on structured data entry of symptoms/findings, the system should auto-suggest a grade. If the investigator selects a different grade, they must provide a clinical justification. The system should flag grade changes that deviate from CTCAE criteria for medical monitor review.

## Acceptance Criteria

- [ ] CTCAE v5.0 grading criteria displayed contextually when AE term is selected
- [ ] Structured data entry for grade-determining factors (symptoms, lab values, interventions)
- [ ] Auto-suggested grade computed from structured inputs per CTCAE definitions
- [ ] Clinical justification required when investigator overrides suggested grade
- [ ] Grade overrides flagged for medical monitor review in a dedicated queue
- [ ] Support for CTCAE version configuration per study (v4.03 and v5.0 minimum)
- [ ] MedDRA to CTCAE term mapping maintained and version-controlled
- [ ] Batch re-grading tool for when CTCAE version changes mid-study via protocol amendment

## Technical Notes

The CTCAE grading logic should be implemented as a decision tree per AE term, stored as structured data (JSON) that can be updated without code deployment. The auto-grading engine should return a grade with confidence level (definite, probable, requires clinical judgment).

## Edge Cases

- AE terms not in CTCAE (custom sponsor terms) — allow manual grading without auto-suggestion
- Lab-based grading criteria that depend on baseline values
- Grade 5 (death) should trigger immediate SAE/SUSAR workflow regardless of auto-grading
- Pre-existing conditions that affect grading baseline`,
    status: "in-progress",
    priority: "high",
    labelNames: ["Feature", "Enhancement"],
    cycleIndex: 1,
  },
  {
    title: "Implement automated SUSAR detection and expedited regulatory reporting workflow",
    description: `## Problem Statement

Suspected Unexpected Serious Adverse Reactions (SUSARs) require expedited reporting to regulatory authorities within strict timelines: fatal/life-threatening SUSARs within 7 calendar days, all other SUSARs within 15 calendar days (per ICH-GCP and EU CTR). Our current system requires manual identification of SUSARs by the medical monitor, followed by manual entry into a separate safety database. This manual handoff has resulted in two near-misses where reporting timelines were almost breached, and one actual timeline breach due to miscommunication between teams.

## Expected Behavior vs Current Behavior

**Current:** When a Serious Adverse Event (SAE) is reported, the medical monitor reviews it in the EDC system, determines if it qualifies as a SUSAR, and then separately enters the case into the safety reporting system (Argus/AriSGlobal). The "clock start" date is tracked manually in a spreadsheet.

**Expected:** The system should automatically evaluate SAEs against SUSAR criteria: (1) Is it serious? (already flagged as SAE), (2) Is there a reasonable causal relationship to the study drug?, (3) Is it unexpected? (not listed in the Reference Safety Information / Investigator's Brochure). When all criteria are met, the system auto-generates a SUSAR alert, starts the regulatory clock, creates the initial CIOMS-I form, and sends escalation notifications at T-3 days, T-1 day, and T-0.

## Acceptance Criteria

- [ ] Automated SUSAR triage based on seriousness, causality, and expectedness criteria
- [ ] Reference Safety Information (RSI) / IB term list maintained per study and version-controlled
- [ ] Regulatory clock auto-starts when SUSAR criteria are met; Day 0 = awareness date
- [ ] Auto-generated CIOMS-I form pre-populated from eCRF SAE data
- [ ] Tiered escalation notifications: T-3, T-1, T-0, T+1 (breach)
- [ ] Dashboard showing all SUSARs with their reporting status and clock countdown
- [ ] Integration API to push SUSAR cases to external safety databases (Argus, AriSGlobal)
- [ ] Blinded and unblinded versions of SUSAR reports per user access level
- [ ] Audit trail for all SUSAR triage decisions (auto and manual overrides)

## Technical Notes

The RSI/IB term list should be stored as a versioned MedDRA-coded list with effective dates. Consider using a state machine for the SUSAR lifecycle (detected, triaged, reported, followed up, closed).

## Edge Cases

- Investigator changes causality assessment from "not related" to "possibly related" after initial SAE entry — SUSAR criteria must be re-evaluated
- IB update adds a term to the RSI — existing open SUSARs for that term may need to be reclassified
- Blinded study: SUSAR report must be unblinded for regulatory submission but blinded for site-level reporting
- Multi-country study: different regulatory authorities have different reporting timelines`,
    status: "in-progress",
    priority: "high",
    labelNames: ["Feature", "Compliance"],
    cycleIndex: 1,
  },
  {
    title: "Add subject vital signs trending with configurable alert thresholds",
    description: `## Problem Statement

Investigators and medical monitors need to quickly identify clinically significant trends in subject vital signs (blood pressure, heart rate, temperature, respiratory rate, weight, SpO2) over the course of a study. Currently, vital signs are displayed as a flat table of values per visit with no longitudinal visualization. Identifying a gradual decline in blood pressure or a steady weight loss trend requires manually scanning across visits in the eCRF, which is impractical for long-running studies with 20+ visits.

## Expected Behavior vs Current Behavior

**Current:** Vital signs are displayed in a visit-by-visit tabular format. Each visit's vital signs form shows only that visit's values. There is no cross-visit trending view. No automated alerting exists for values outside normal ranges.

**Expected:** A dedicated vital signs trending view per subject that displays all vital sign parameters as interactive line charts over time. Configurable alert thresholds should trigger notifications when: (1) a value exceeds absolute limits, (2) a value changes more than a configurable percentage from baseline, or (3) a trend analysis shows a clinically significant trajectory.

## Acceptance Criteria

- [ ] Interactive line chart displaying all vital sign parameters over study visits/dates
- [ ] Overlay of normal range bands (configurable per study population)
- [ ] Configurable absolute threshold alerts per vital sign per study
- [ ] Percentage-change-from-baseline alerts with configurable thresholds
- [ ] Trend detection for 3+ consecutive directional changes exceeding threshold
- [ ] Alerts displayed inline on the chart and in a dedicated safety alerts queue
- [ ] Print-friendly version of trends for inclusion in site monitoring reports
- [ ] Support for unscheduled visit data points on the timeline
- [ ] Accessibility: chart data available in tabular format for screen readers

## Technical Notes

Use a client-side charting library (e.g., D3.js or Recharts) with server-side data aggregation. Baseline is defined per protocol — typically Visit 1 / Day 1 pre-dose, but this must be configurable. Consider using simple linear regression for trend detection.

## Edge Cases

- Missing vital sign measurements at some visits — chart should show gaps, not interpolate
- Baseline not yet established — percentage change alerts should be suppressed
- Units conversion between sites (e.g., Fahrenheit vs. Celsius for temperature)
- Vital signs taken at multiple time points within a single visit`,
    status: "in-progress",
    priority: "medium",
    labelNames: ["Feature", "UX"],
    cycleIndex: 1,
  },
  {
    title: "Fix incorrect randomization stratification when site enrollment exceeds block size",
    description: `## Problem Statement

A critical defect has been identified in the randomization module. When a site's enrollment count exceeds the configured block size within a stratification factor level, the system is not correctly cycling to the next permuted block. Instead, it repeats assignments from the current block, leading to imbalanced treatment arm allocation. This was detected during an interim analysis of a Phase III cardiovascular trial where one site had a 60/40 split instead of the expected 50/50 allocation after enrolling 24 subjects (block size = 4, expected 12:12).

## Expected Behavior vs Current Behavior

**Current:** The randomization service selects treatment assignments from a permuted block list. When the block pointer reaches the end of a block, it wraps around to position 0 of the same block instead of advancing to the next block. This appears to be an off-by-one error in the block advancement logic.

**Expected:** When the last assignment in a block is consumed, the block pointer should advance to the next pre-generated permuted block. If the pre-generated block list is exhausted, new blocks should be generated on-demand using the study's seed and the Sequential Block Algorithm. The block pointer state must be tracked per stratification group, not globally.

## Acceptance Criteria

- [ ] Block advancement correctly moves to next block when current block is exhausted
- [ ] Block pointer is maintained per stratification group (site x strata combination)
- [ ] On-demand block generation triggers when pre-generated blocks are exhausted
- [ ] Treatment allocation balance verified across all active sites after fix deployment
- [ ] Retrospective analysis report generated showing impact on affected sites
- [ ] Statistician sign-off on allocation balance assessment before fix goes live
- [ ] Unit tests cover block boundary transitions for all block sizes (2, 4, 6, 8)
- [ ] Integration test simulates 1,000 randomizations across 50 sites with 3 strata

## Technical Notes

The bug is in \`RandomizationService.getNextAssignment()\` where \`blockIndex = currentIndex % blockSize\` should be followed by a block advancement when \`currentIndex % blockSize === 0 && currentIndex > 0\`. The fix must be backward-compatible — existing randomization sequences cannot be retroactively changed. All randomization operations must be wrapped in a database transaction with row-level locking.

## Edge Cases

- Concurrent randomizations at the same site in the same stratum — must be serialized
- Undo/cancel randomization (e.g., screen failure) — block pointer should not rewind
- Dynamic randomization (minimization algorithm) is used for some studies — this fix applies only to permuted block randomization
- Studies with unequal allocation ratios (2:1) use different block sizes`,
    status: "in-review",
    priority: "high",
    labelNames: ["Bug"],
    cycleIndex: 1,
  },
  {
    title: "Implement site monitoring visit scheduling and checklist management",
    description: `## Problem Statement

Clinical Research Associates (CRAs) currently manage their site monitoring visit schedules outside of our CTMS, using a combination of Outlook calendars and sponsor-specific tracking spreadsheets. This means the CTMS has no visibility into monitoring activities, making it impossible to generate accurate oversight metrics or correlate monitoring frequency with site risk indicators from RBQM.

## Expected Behavior vs Current Behavior

**Current:** CRAs schedule monitoring visits externally. After a visit, they upload a PDF monitoring visit report to the CTMS document repository. There is no structured data about visit findings, action items, or follow-up timelines.

**Expected:** The CTMS should provide: (1) a monitoring visit scheduler integrated with the RBQM risk dashboard, (2) a configurable monitoring visit checklist that CRAs complete during the visit, (3) an action item tracker with assignees and due dates, and (4) automated generation of the MVR from the completed checklist.

## Acceptance Criteria

- [ ] Monitoring visit scheduler with calendar view, conflict detection, and site timezone support
- [ ] RBQM-driven visit frequency recommendations based on site risk scores
- [ ] Configurable monitoring visit checklists per sponsor/study with version control
- [ ] Offline-capable checklist completion for sites with poor internet connectivity
- [ ] Action item tracker with email notifications for overdue items
- [ ] Automated MVR generation in sponsor-branded PDF format
- [ ] Dashboard showing monitoring visit coverage, findings by category, and action item resolution rates
- [ ] Integration with site contact directory for visit scheduling communications

## Technical Notes

The monitoring visit checklist should be built using the same form engine as eCRFs to reuse existing infrastructure. Offline capability requires a service worker and IndexedDB-based local data store with sync-on-reconnect. MVR PDF generation should use a template engine (e.g., Puppeteer or wkhtmltopdf).

## Edge Cases

- CRA reassignment mid-study — visit history and pending action items must transfer
- Remote monitoring visits should be a distinct visit type with a different checklist
- Visit cancelled due to site closure — need to track reason and reschedule
- Multi-day monitoring visits spanning different calendar days`,
    status: "done",
    priority: "medium",
    labelNames: ["Feature", "Enhancement"],
    cycleIndex: 1,
  },
  {
    title: "Build configurable eCRF edit check engine with cross-form validation rules",
    description: `## Problem Statement

Edit checks are validation rules applied to eCRF data that flag potential data entry errors or protocol violations. Our current edit check system supports only single-field validations (range checks, format checks, required field checks) defined at the form level. Clinical data managers need cross-field and cross-form edit checks — for example, verifying that an AE start date falls within the subject's study participation period, or that a reported concomitant medication indication matches one of the subject's medical history entries.

## Expected Behavior vs Current Behavior

**Current:** Edit checks are limited to intra-form, single-field validations. Cross-form validations are performed manually via SQL queries on a weekly basis by the DM team.

**Expected:** A comprehensive edit check engine that supports: (1) single-field checks, (2) cross-field checks within a form, (3) cross-form checks, (4) cross-visit checks, and (5) external data checks.

## Acceptance Criteria

- [ ] Edit check engine supports all 5 levels of validation described above
- [ ] Edit checks are configurable via a UI for clinical data managers (no code deployment required)
- [ ] Check definitions use a structured DSL with autocomplete for form fields and cross-references
- [ ] Checks can fire on data entry (real-time) or as batch operations (nightly)
- [ ] Failed checks generate data queries automatically assigned to the appropriate site
- [ ] Edit check test mode: run checks against existing data to preview impact before activation
- [ ] Check results dashboard with metrics: open queries by site, by check, by age
- [ ] Version control for edit check specifications with approval workflow

## Technical Notes

The edit check DSL should compile to SQL for batch execution and to JavaScript for real-time client-side execution. Use an AST-based approach so the same check definition works in both contexts. Cross-form checks require a data resolver that can efficiently fetch related form data.

## Edge Cases

- Circular dependencies between edit checks
- Edit checks on repeating form groups — the check must specify which row(s) to evaluate
- Checks that reference data not yet entered (future visits) — should be deferred
- Protocol amendment changes an eligibility criterion — edit checks must be updated and re-run`,
    status: "done",
    priority: "medium",
    labelNames: ["Feature", "Enhancement"],
    cycleIndex: 1,
  },
  {
    title: "Improve SAE initial notification email delivery reliability and tracking",
    description: `## Problem Statement

Serious Adverse Event (SAE) initial notifications must be delivered to sponsors within 24 hours of site awareness per most clinical trial agreements. Our system sends these notifications via email, but we have no delivery confirmation mechanism. In the past quarter, three SAE notifications were delayed because they were caught in spam filters, and two were sent to outdated distribution lists after personnel changes at the sponsor.

## Expected Behavior vs Current Behavior

**Current:** When an SAE is marked on the AE eCRF, an email is sent to a static distribution list configured per study. The system logs that the email was sent but has no visibility into whether it was delivered, bounced, or marked as spam.

**Expected:** SAE notifications should use a multi-channel delivery approach: primary email with delivery/read tracking, plus a backup in-app notification and optional SMS for urgent (fatal/life-threatening) SAEs. Delivery failures should trigger automatic escalation to a backup channel within 30 minutes.

## Acceptance Criteria

- [ ] Email delivery tracking via webhook integration with the email service provider
- [ ] Delivery status dashboard: sent, delivered, opened, bounced, failed
- [ ] Automatic retry via backup channel if delivery not confirmed within 30 minutes
- [ ] In-app notification as a parallel channel for all SAE notifications
- [ ] Distribution list management UI with role-based auto-population from study team roster
- [ ] Audit trail for all distribution list changes
- [ ] Configurable escalation path: SAE coordinator, medical monitor, sponsor safety head
- [ ] Monthly delivery reliability report for sponsor oversight

## Technical Notes

Migrate from direct SMTP to a transactional email service (SendGrid or AWS SES) that provides webhook-based delivery status updates. Implement a notification state machine: created, sent, delivered, opened (or bounced/failed, escalated, re-sent). For SMS backup, use Twilio or AWS SNS.

## Edge Cases

- Email service provider outage — must have a secondary provider configured as failover
- SAE reported outside business hours — escalation must still function via SMS/push
- SAE notification for a blinded study — email content must not reveal treatment assignment
- Bulk SAE reporting — avoid notification flooding with intelligent batching`,
    status: "in-review",
    priority: "medium",
    labelNames: ["Enhancement", "Infrastructure"],
    cycleIndex: 1,
  },
  {
    title: "Add informed consent tracking with eConsent version management",
    description: `## Problem Statement

Informed Consent Form (ICF) version management is a critical regulatory requirement. When a protocol amendment results in a new ICF version, all active subjects must be re-consented with the new version within a sponsor-defined timeframe. Our system currently tracks only whether an initial consent was obtained (date and checkbox on the Demographics form) but does not track ICF version numbers, re-consent events, or consent withdrawal. This gap was identified as a major finding in a recent mock FDA inspection.

## Expected Behavior vs Current Behavior

**Current:** A single date field on the Demographics eCRF records when consent was obtained. ICF versions are tracked in a separate document management system. There is no way to determine which ICF version a subject signed.

**Expected:** A dedicated consent management module that tracks: (1) all ICF versions per study/site with approval dates, (2) per-subject consent events (initial consent, re-consent, withdrawal) with the specific ICF version signed, (3) automated alerts when subjects need re-consent after a new ICF version is activated, and (4) a consent compliance dashboard.

## Acceptance Criteria

- [ ] ICF version registry with version number, effective date, IRB/EC approval reference
- [ ] Per-subject consent timeline showing all consent events
- [ ] Auto-generated re-consent task list when a new ICF version is activated at a site
- [ ] Configurable re-consent window with escalating reminders
- [ ] Consent withdrawal workflow that triggers downstream actions
- [ ] Support for optional consent elements (e.g., biobanking, genetic testing)
- [ ] eConsent integration: ability to capture electronic consent signatures
- [ ] Regulatory-ready consent audit report per subject and per site

## Technical Notes

The consent module should be a first-class entity in the data model, not a field on the Demographics form. Create a \`consent_events\` table linked to subjects, ICF versions, and sites. For eConsent, consider integrating with DocuSign or Adobe Sign via their clinical trial-specific APIs.

## Edge Cases

- Subject is a minor who reaches age of majority mid-study — transition from parental consent to adult consent
- Legally authorized representative (LAR) provides consent — track LAR identity and relationship
- Subject withdraws consent for optional biobanking but remains in the main study
- Site-specific ICF versions (different IRBs approve at different times)`,
    status: "todo",
    priority: "medium",
    labelNames: ["Feature", "Compliance"],
    cycleIndex: 1,
  },
  {
    title: "Implement drug accountability and IP dispensing log in CTMS",
    description: `## Problem Statement

Investigational Product (IP) accountability is a core GCP requirement (ICH E6 Section 4.6). Sites must maintain accurate records of IP received, dispensed to subjects, returned, and destroyed. Our CTMS currently has no drug accountability module — sites track this in paper logs or sponsor-provided Excel templates, and CRAs verify these logs during monitoring visits.

## Expected Behavior vs Current Behavior

**Current:** No IP tracking capability in the CTMS. Sites maintain paper or Excel-based drug accountability logs. There is no real-time visibility into site IP inventory levels, leading to emergency shipments when sites unexpectedly run low.

**Expected:** A drug accountability module that tracks the complete IP lifecycle: shipment receipt at site, storage conditions verification, dispensing to subject, return/destruction, reconciliation. The module should provide real-time inventory dashboards, automated re-supply triggers, and temperature excursion logging for cold-chain products.

## Acceptance Criteria

- [ ] IP shipment receipt logging with lot number, expiry date, quantity, and condition on arrival
- [ ] Dispensing log linked to subject ID, visit, and randomization number
- [ ] Return and destruction logging with witness documentation
- [ ] Real-time inventory dashboard per site with min/max stock level alerts
- [ ] Automated re-supply trigger when inventory drops below configurable threshold
- [ ] Temperature excursion logging for cold-chain IP with quarantine workflow
- [ ] Per-subject IP reconciliation report
- [ ] CRA verification workflow integrated with monitoring visit checklist
- [ ] Blinding maintenance: in blinded studies, IP module must not reveal treatment assignment

## Technical Notes

The IP module must integrate with the randomization module to pull kit assignments. For blinded studies, the IP module uses kit numbers, not treatment codes. Barcode/QR code scanning for kit receipt and dispensing would reduce data entry errors — consider a mobile-friendly UI with camera integration.

## Edge Cases

- IP with multiple components (e.g., drug + placebo in a crossover study)
- IP re-dispensing after a dose modification — handle partial kit returns
- Expired IP discovered during inventory check — quarantine and destruction workflow
- Emergency unblinding affects IP tracking`,
    status: "todo",
    priority: "low",
    labelNames: ["Feature"],
    cycleIndex: 1,
  },
  // --- Cycle 3: Reporting & Analytics ---
  {
    title: "Build RBQM Key Risk Indicator dashboard with configurable thresholds and drill-down",
    description: `## Problem Statement

Risk-Based Quality Management (RBQM) as outlined in ICH E6(R2) and FDA guidance requires sponsors to implement a systematic approach to identifying, evaluating, and mitigating risks to clinical trial data quality and subject safety. Our CTMS currently lacks a centralized RBQM dashboard. Key Risk Indicators (KRIs) are calculated ad-hoc by the clinical operations team using R scripts against database extracts, producing static PDF reports on a monthly cadence.

## Expected Behavior vs Current Behavior

**Current:** No real-time RBQM capability. Monthly static KRI reports produced manually via R scripts. Reports show aggregate metrics per site but lack statistical context (no thresholds, no control limits, no trend analysis).

**Expected:** A real-time RBQM dashboard that computes KRIs nightly (or on-demand) with statistical thresholds to identify outlier sites. The dashboard should display KRIs in a visual format (control charts, heatmaps, traffic light indicators) with drill-down capability from the KRI to the underlying data.

## Acceptance Criteria

- [ ] Configurable KRI library with at least 20 standard indicators
- [ ] Statistical threshold calculation using study-level mean +/- configurable standard deviations
- [ ] Visual display: control charts with UCL/LCL, site-level heatmap, traffic light summary
- [ ] Drill-down from any KRI to the underlying subject-level data
- [ ] Configurable evaluation frequency: nightly batch, weekly, or on-demand
- [ ] Automated risk signal detection when a site exceeds thresholds for N consecutive periods
- [ ] Risk action management: document risk assessment, mitigation plan, and resolution
- [ ] Export to PDF/Excel for regulatory submission and sponsor reporting

## Technical Notes

KRI computation should be implemented as scheduled database jobs that populate a \`kri_results\` materialized view. Use Shewhart X-bar chart methodology with configurable sigma limits. Consider using ECharts or Highcharts for interactive visualizations.

## Edge Cases

- New sites with insufficient data for statistical comparison — suppress KRI evaluation until minimum data threshold
- Sites in different countries with different enrollment timelines — normalize KRIs by operational time
- Study with only 3-4 sites: statistical thresholds are unreliable — offer historical benchmark comparison
- KRI definitions that change mid-study via protocol amendment`,
    status: "backlog",
    priority: "medium",
    labelNames: ["Feature", "Enhancement"],
    cycleIndex: 2,
  },
  {
    title: "Create automated regulatory submission package generator (TMF compilation)",
    description: `## Problem Statement

At the conclusion of a clinical trial (or upon regulatory request), sponsors must compile a Trial Master File (TMF) that contains all essential documents per the DIA TMF Reference Model. Our CTMS stores many of the required artifacts but has no automated mechanism to compile them into the required TMF structure. Currently, the regulatory affairs team manually extracts documents from multiple systems and organizes them into the TMF folder structure, a process that takes 2-4 weeks for a mid-size study.

## Expected Behavior vs Current Behavior

**Current:** Documents are stored in the CTMS document repository with basic metadata. The TMF compilation is a manual process involving document-to-reference-model mapping, completeness verification, and package assembly.

**Expected:** The system should provide: (1) a TMF completeness tracker that continuously monitors artifact availability, (2) an automated compilation engine, (3) a gap analysis report, and (4) export in regulatory authority-accepted formats (eCTD for FDA, EU CTR format for EMA).

## Acceptance Criteria

- [ ] TMF Reference Model mapping for all document types stored in the CTMS
- [ ] Real-time TMF completeness score per study and per site
- [ ] Automated TMF compilation into DIA Reference Model folder structure
- [ ] Gap analysis report with missing artifacts categorized by criticality
- [ ] Standardized document naming convention applied automatically during compilation
- [ ] Support for eCTD (FDA) and EU CTR (EMA) submission formats
- [ ] Quality check: verify document dates, signatures, and version consistency
- [ ] Incremental TMF updates: only recompile changed/added documents since last compilation

## Technical Notes

The TMF Reference Model has ~200 artifact types organized into zones (Central, Country, Site). The compilation engine should be an async job that produces a ZIP archive with the correct folder hierarchy. Document naming should follow: Zone_Section_Artifact_SiteID_Date_Version.

## Edge Cases

- Multi-country studies with country-specific regulatory documents
- Documents that map to multiple TMF artifact types
- Superseded document versions — TMF should include current version but archive previous
- Third-party vendor documents uploaded by non-CTMS users`,
    status: "backlog",
    priority: "low",
    labelNames: ["Feature", "Compliance"],
    cycleIndex: 2,
  },
  {
    title: "Implement cross-study analytics and portfolio-level performance metrics",
    description: `## Problem Statement

Sponsors running multiple clinical trials need portfolio-level visibility into operational performance across all studies. Currently, each study in our CTMS is a siloed instance — there is no way to compare enrollment rates, data quality metrics, or site performance across studies. Portfolio managers must manually extract data from each study and compile it in external tools (Tableau, Power BI).

## Expected Behavior vs Current Behavior

**Current:** Each study has its own reporting dashboards. No cross-study data aggregation exists within the CTMS. Portfolio-level reporting requires manual data extraction.

**Expected:** A portfolio analytics module that aggregates data across all studies and provides: (1) cross-study performance benchmarks, (2) site performance scorecards, (3) CRO performance metrics, (4) resource utilization analysis, and (5) predictive analytics for enrollment forecasting.

## Acceptance Criteria

- [ ] Cross-study enrollment dashboard: actual vs. planned enrollment curves
- [ ] Site performance scorecard: composite score across all studies at that site
- [ ] CRO/vendor performance comparison: normalized metrics per outsourced function
- [ ] Study milestone tracker: portfolio-level Gantt chart with critical path highlighting
- [ ] Predictive enrollment model using historical data and current velocity
- [ ] Configurable executive summary report with key portfolio metrics
- [ ] Data export to Tableau/Power BI via API or scheduled data feeds
- [ ] Role-based access: users see only studies they are authorized to view

## Technical Notes

Cross-study analytics requires a data warehouse or read-replica approach. Consider implementing a nightly ETL pipeline that denormalizes study data into an analytics schema. For enrollment prediction, a simple linear extrapolation combined with site-level adjustment factors provides a reasonable baseline.

## Edge Cases

- Studies with different phases have fundamentally different enrollment dynamics
- Confidential studies that should not appear in portfolio-level reports for certain users
- Acquired studies migrated from another CTMS — historical data may have different metric definitions`,
    status: "backlog",
    priority: "low",
    labelNames: ["Feature", "Enhancement"],
    cycleIndex: 2,
  },
  {
    title: "Add medical coding workflow with MedDRA and WHO Drug Dictionary integration",
    description: `## Problem Statement

Medical coding — the process of mapping free-text or investigator-reported terms to standardized medical dictionaries — is a critical data management activity in clinical trials. Adverse Events must be coded to MedDRA (Medical Dictionary for Regulatory Activities), and concomitant medications must be coded to the WHO Drug Dictionary (WHO-DD). Our system currently requires data managers to code terms manually using external dictionary browser tools and then enter the codes back into the eCRF. This is slow (average 3-5 minutes per term), error-prone, and does not leverage auto-coding capabilities.

## Expected Behavior vs Current Behavior

**Current:** Investigators enter AE terms and medication names as free text in the eCRF. Data managers manually look up these terms in external MedDRA and WHO-DD browser applications, find the appropriate codes, and enter them into hidden coding fields on the eCRF.

**Expected:** An integrated medical coding workflow that: (1) auto-codes verbatim terms using fuzzy matching, (2) presents a coding workbench for ambiguous terms, (3) maintains a study-specific synonym list, (4) supports multi-level coding, and (5) handles dictionary version upgrades with impact analysis.

## Acceptance Criteria

- [ ] MedDRA integration supporting versions 24.0+ with configurable version per study
- [ ] WHO Drug Dictionary integration supporting current and previous versions
- [ ] Auto-coding engine with configurable confidence threshold
- [ ] Coding workbench UI with search, browse hierarchy, and approve/reject workflow
- [ ] Study-specific synonym list with export/import between studies
- [ ] Multi-level coding display: full hierarchy shown for each coded term
- [ ] Dictionary version upgrade tool with impact analysis
- [ ] Coding metrics: auto-code rate, manual coding turnaround time, queries generated
- [ ] Audit trail for all coding decisions including auto-coded terms

## Technical Notes

MedDRA and WHO-DD are licensed dictionaries — they must be loaded from official distribution files. The dictionary data should be stored in dedicated schema tables with full-text search indexes. Auto-coding should use exact match, synonym list lookup, and Levenshtein distance for fuzzy matching. Consider using pg_trgm extension for trigram-based similarity scoring.

## Edge Cases

- Verbatim terms in languages other than English — support multi-language MedDRA
- Combination medications that need to be coded as combination products
- MedDRA terms deprecated in a newer version — upgrade tool must suggest replacement
- Investigator-entered terms with typos — fuzzy matching should suggest corrections`,
    status: "todo",
    priority: "medium",
    labelNames: ["Feature", "Enhancement"],
    cycleIndex: 2,
  },
  {
    title: "Optimize eCRF form rendering performance for complex visit forms",
    description: `## Problem Statement

Several sponsors have reported poor performance when loading complex eCRF forms, particularly those with many repeating groups (e.g., concomitant medications log, prior therapies, medical history). Forms with 20+ repeating group rows and 50+ fields take 8-12 seconds to render in the browser, with the main thread blocked during this time. Sites in regions with lower-bandwidth connections report even worse experience, with some forms timing out entirely.

## Expected Behavior vs Current Behavior

**Current:** The eCRF form renderer loads all form metadata and all data rows in a single API call and renders the entire DOM at once. For a form with 30 rows x 12 fields, the initial render creates ~5,000 DOM nodes, blocking the main thread for 8-12 seconds.

**Expected:** Form loading should achieve: (1) initial meaningful paint within 2 seconds, (2) full form interactability within 4 seconds, and (3) smooth scrolling for forms with up to 100 repeating group rows.

## Acceptance Criteria

- [ ] Initial meaningful paint within 2 seconds on 3G connection simulation
- [ ] Full form interactive within 4 seconds on broadband
- [ ] Repeating group rows use virtualized rendering (only visible rows in the DOM)
- [ ] Form metadata and data loaded in progressive chunks (section-by-section)
- [ ] Edit checks execute incrementally as sections load
- [ ] No perceptible jank during scrolling through large repeating groups
- [ ] Performance budget: max 2,000 DOM nodes visible at any time
- [ ] Lighthouse performance score > 80 for the most complex form
- [ ] No regression in form save performance

## Technical Notes

Implement virtual scrolling for repeating groups using react-virtual or a custom IntersectionObserver-based solution. Split the monolithic form API endpoint into section-level endpoints. Consider using React.lazy and Suspense for section-level code splitting. Edit check evaluation should be debounced and run in a Web Worker.

## Edge Cases

- User scrolls quickly through a large repeating group — virtualized rows must mount fast enough
- Edit checks that reference fields in off-screen rows — need a data layer that persists
- Print/PDF export must render ALL rows, not just visible ones
- Screen readers must be able to navigate all rows`,
    status: "todo",
    priority: "medium",
    labelNames: ["Performance", "UX"],
    cycleIndex: 2,
  },
  {
    title: "Implement data quality scoring algorithm for site and study-level report cards",
    description: `## Problem Statement

Data quality in clinical trials is currently assessed using isolated metrics (query rate, missing data rate, protocol deviation rate) that are reviewed independently without a unified scoring framework. Sponsors and CROs need a composite data quality score that aggregates multiple quality dimensions into a single, interpretable metric per site and per study. Without a standardized scoring algorithm, quality assessments are subjective and inconsistent.

## Expected Behavior vs Current Behavior

**Current:** Individual data quality metrics are available in study-level reports but are not aggregated into a composite score. Quality assessments are performed qualitatively during monitoring visits and data review meetings.

**Expected:** A configurable data quality scoring algorithm that computes a composite score (0-100) at the site level and study level. The score should be composed of weighted sub-scores across completeness, consistency, timeliness, accuracy, and conformance.

## Acceptance Criteria

- [ ] Composite quality score (0-100) computed per site and per study
- [ ] Five quality dimensions: completeness, consistency, timeliness, accuracy, conformance
- [ ] Configurable weights per dimension per study
- [ ] Historical trend chart showing quality score evolution over time per site
- [ ] Automated quality tier classification: Green (80+), Yellow (60-79), Red (<60)
- [ ] Drill-down from composite score to dimension scores to individual metrics
- [ ] Comparison view: side-by-side site quality scores with study median benchmark
- [ ] Automated monthly quality report card per site
- [ ] Algorithm documentation exportable for regulatory inspection readiness

## Technical Notes

The scoring algorithm should be a configurable pipeline: (1) compute raw metrics, (2) normalize to 0-1 scale, (3) apply dimensional weights, (4) compute weighted average, (5) apply tier thresholds. Store algorithm configuration and version alongside results so historical scores can be reproduced.

## Edge Cases

- New sites with very few subjects — scores are statistically unreliable; show confidence intervals
- Sites that intentionally do not enroll certain populations — normalization must account for expected differences
- Sites with zero queries might have perfect accuracy or might not be entering data at all
- Sponsors with different quality philosophies — weight configuration must be flexible`,
    status: "backlog",
    priority: "none",
    labelNames: ["Feature", "Enhancement"],
    cycleIndex: 2,
  },
]

export async function seedDemoDataForViewer(
  db: SeedDatabase,
  context: ViewerContext
): Promise<{ issueCount: number; cycleCount: number; labelCount: number }> {
  if (!context.workspaceId) {
    throw new Error("No active workspace")
  }

  const workspaceId = context.workspaceId
  const now = new Date().toISOString()

  // Get the first team for this workspace
  const team = await db.query.teams.findFirst({
    where: eq(schema.teams.workspaceId, workspaceId),
  })

  if (!team) {
    throw new Error("No team found in workspace. Create a team first.")
  }

  // Check if there are already issues in this team (avoid double-seeding)
  const existingIssues = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.issues)
    .where(
      and(
        eq(schema.issues.teamId, team.id),
        sql`${schema.issues.deletedAt} IS NULL`
      )
    )

  if (existingIssues[0] && existingIssues[0].count > 0) {
    throw new Error("This team already has issues. Seed data is for empty teams only.")
  }

  // 1. Create labels (upsert — skip existing by name)
  const labelMap = new Map<string, string>()
  for (const labelDef of LABEL_DEFINITIONS) {
    const existing = await db.query.labels.findFirst({
      where: and(
        eq(schema.labels.workspaceId, workspaceId),
        eq(schema.labels.name, labelDef.name)
      ),
    })

    if (existing) {
      labelMap.set(labelDef.name, existing.id)
    } else {
      const labelId = crypto.randomUUID()
      await db.insert(schema.labels).values({
        id: labelId,
        workspaceId,
        name: labelDef.name,
        color: labelDef.color,
        createdAt: now,
        updatedAt: now,
      })
      labelMap.set(labelDef.name, labelId)
    }
  }

  // 2. Create cycles
  const cycleIds: string[] = []
  const latestCycle = await db.query.cycles.findFirst({
    where: eq(schema.cycles.teamId, team.id),
    orderBy: [sql`${schema.cycles.number} DESC`],
  })
  let nextCycleNumber = (latestCycle?.number ?? 0) + 1

  for (const cycleDef of CYCLE_DEFINITIONS) {
    const cycleId = crypto.randomUUID()
    await db.insert(schema.cycles).values({
      id: cycleId,
      teamId: team.id,
      name: cycleDef.name,
      number: nextCycleNumber++,
      startDate: cycleDef.startDate,
      endDate: cycleDef.endDate,
      status: cycleDef.status,
      createdAt: now,
      updatedAt: now,
    })
    cycleIds.push(cycleId)
  }

  // 3. Create issues in a transaction to safely increment the sequence counter
  await db.transaction(async (tx) => {
    for (const issueDef of SEED_ISSUES) {
      // Increment sequence number
      const [teamRow] = await tx
        .update(schema.teams)
        .set({ nextIssueNumber: sql`${schema.teams.nextIssueNumber} + 1` })
        .where(eq(schema.teams.id, team.id))
        .returning({
          identifier: schema.teams.identifier,
          sequenceNumber: schema.teams.nextIssueNumber,
        })

      if (!teamRow) throw new Error("Team not found during issue creation")

      const seqNum = teamRow.sequenceNumber - 1
      const identifier = `${teamRow.identifier}-${seqNum}`
      const issueId = crypto.randomUUID()

      // Determine timestamps based on status
      const completedAt =
        issueDef.status === "done" ? now : null
      const cancelledAt =
        issueDef.status === "cancelled" ? now : null

      await tx.insert(schema.issues).values({
        id: issueId,
        workspaceId,
        teamId: team.id,
        cycleId: cycleIds[issueDef.cycleIndex] ?? null,
        creatorUserId: context.userId,
        assigneeUserId: context.userId,
        identifier,
        sequenceNumber: seqNum,
        title: issueDef.title,
        description: issueDef.description,
        status: issueDef.status,
        priority: issueDef.priority,
        priorityScore: priorityScoreMap[issueDef.priority] ?? 0,
        dueDate: null,
        createdAt: now,
        updatedAt: now,
        completedAt,
        cancelledAt,
      })

      // Create activity entry
      await tx.insert(schema.issueActivity).values({
        id: crypto.randomUUID(),
        issueId,
        actorUserId: context.userId,
        type: "created",
        data: {},
        createdAt: now,
      })

      // Attach labels
      for (const labelName of issueDef.labelNames) {
        const labelId = labelMap.get(labelName)
        if (labelId) {
          await tx.insert(schema.issueLabels).values({
            issueId,
            labelId,
            createdAt: now,
          })
        }
      }
    }
  })

  return {
    issueCount: SEED_ISSUES.length,
    cycleCount: CYCLE_DEFINITIONS.length,
    labelCount: LABEL_DEFINITIONS.length,
  }
}
