<!--
Sync Impact Report:
- Version: 0.0.0 → 1.0.0 (MAJOR: Initial ratification)
- Ratification Date: 2026-02-11
- Modified Principles: All principles created (initial version)
- Added Sections: All sections (initial version)
- Removed Sections: None
- Templates Requiring Updates: All verified ✅
- Follow-up TODOs: None
-->

# Specify Framework Constitution

## Core Principles

### I. Specification-First (NON-NEGOTIABLE)

Every feature MUST begin with a specification document that:

- Describes **WHAT** users need and **WHY**, not **HOW** to implement
- Is written for business stakeholders, not developers
- Contains no implementation details (languages, frameworks, APIs, code structure)
- Defines measurable, technology-agnostic success criteria
- Identifies user scenarios with clear acceptance criteria

**Rationale**: Specifications establish shared understanding between stakeholders and
developers before any code is written. This prevents scope creep, reduces rework, and
ensures features deliver actual user value. By avoiding implementation details, specs
remain stable even as technical approaches evolve.

### II. Test-Driven Development (NON-NEGOTIABLE)

Development MUST follow the TDD cycle:

1. Write tests that capture feature requirements
2. Obtain user/stakeholder approval of test scenarios
3. Verify tests fail (red)
4. Implement minimum code to pass tests (green)
5. Refactor while keeping tests passing

Tests MUST be written before implementation. No exceptions.

**Rationale**: TDD ensures code meets requirements, prevents regression, and produces
testable designs. The red-green-refactor cycle provides a safety net for continuous
improvement and gives confidence that features work as specified.

### III. User-Centered Design

Feature design MUST prioritize user value:

- User stories are prioritized (P1, P2, P3...) and independently testable
- Each story delivers standalone value as a potential MVP
- Success criteria are measurable from user/business perspective
- Edge cases and error scenarios are explicitly identified
- Requirements are testable and unambiguous

**Rationale**: User-centered design keeps teams focused on outcomes that matter. By
making stories independently testable, teams can ship value incrementally rather than
waiting for complete feature sets. This reduces risk and enables faster feedback.

### IV. Incremental Delivery

Implementation MUST proceed in phases:

1. **Setup**: Project structure and dependencies
2. **Foundation**: Shared infrastructure blocking all stories
3. **User Stories**: Implemented in priority order (P1 → P2 → P3)
4. **Polish**: Cross-cutting improvements after stories complete

Each user story MUST be:

- Completable independently after Foundation phase
- Testable without other stories being complete
- Shippable as an MVP increment

**Rationale**: Incremental delivery allows teams to validate assumptions early, pivot
if needed, and deliver value continuously. By ensuring stories are independent,
multiple team members can work in parallel without blocking each other.

### V. Documentation & Traceability

Every feature MUST maintain these artifacts:

- `spec.md`: User requirements and acceptance criteria
- `plan.md`: Technical context and implementation strategy
- `research.md`: Technology decisions and alternatives considered
- `data-model.md`: Entities, relationships, validation rules
- `contracts/`: API contracts (OpenAPI, GraphQL schemas, etc.)
- `tasks.md`: Actionable task list with dependencies
- `checklists/`: Quality validation checklists

All artifacts MUST:

- Link to related documents for traceability
- Be updated when requirements change
- Reference the constitution for compliance

**Rationale**: Comprehensive documentation creates institutional knowledge, enables
onboarding, and preserves decision context. Traceability between artifacts helps teams
understand why decisions were made and ensures changes propagate appropriately.

### VI. Simplicity & Pragmatism

Complexity MUST be justified:

- Start with simplest solution that meets requirements
- Make informed guesses rather than waiting for perfect information
- Limit clarification questions to critical decisions (max 3 per phase)
- Avoid over-engineering for hypothetical future needs
- Document assumptions clearly when making pragmatic choices

When complexity is unavoidable, MUST document:

- Why complexity is needed
- Simpler alternatives considered
- Why those alternatives were insufficient

**Rationale**: Simplicity reduces cognitive load, maintenance burden, and bug surface
area. By making informed guesses and documenting assumptions, teams can move forward
decisively while maintaining the ability to correct course if assumptions prove wrong.

### VII. Agent-Assisted Development

The Specify framework MUST support AI agent collaboration:

- Commands expose clear, structured workflows for agents
- Templates guide agents through required steps
- Output is machine-readable (JSON, markdown, OpenAPI)
- Agent context files track technology decisions across features
- Validation checklists ensure quality without manual oversight

Agents MUST follow constitution rules without exception.

**Rationale**: AI agents can accelerate development when given clear structure and
constraints. By encoding best practices in commands and templates, the framework
ensures consistent quality whether work is done by humans or agents.

## Development Workflow

### Feature Lifecycle

1. **Specify** (`/speckit.specify`): Create specification from natural language
   description
2. **Clarify** (`/speckit.clarify`): Resolve underspecified requirements (optional)
3. **Plan** (`/speckit.plan`): Generate technical design and research
4. **Tasks** (`/speckit.tasks`): Break plan into dependency-ordered tasks
5. **Implement** (`/speckit.implement`): Execute tasks with TDD cycle
6. **Analyze** (`/speckit.analyze`): Validate cross-artifact consistency (optional)
7. **Issues** (`/speckit.taskstoissues`): Convert tasks to GitHub issues (optional)

Each phase MUST complete before proceeding to the next. Gate failures MUST be resolved
or explicitly justified.

### Quality Gates

Before proceeding from specification to planning:

- [ ] All mandatory spec sections completed
- [ ] Requirements are testable and unambiguous
- [ ] Success criteria are measurable and technology-agnostic
- [ ] [NEEDS CLARIFICATION] markers resolved (max 3)
- [ ] User scenarios cover primary flows

Before proceeding from planning to implementation:

- [ ] Constitution check passed or violations justified
- [ ] All NEEDS CLARIFICATION resolved via research
- [ ] Data model defines entities with validation rules
- [ ] API contracts generated for all user actions
- [ ] Quickstart guide written for developers

Before marking user story complete:

- [ ] Tests written first and initially failed
- [ ] All tests passing for this story
- [ ] Story independently testable without other stories
- [ ] Story delivers standalone value

### Code Review Requirements

All pull requests MUST verify:

- [ ] Constitution compliance (principles followed)
- [ ] Tests exist and pass
- [ ] Documentation updated
- [ ] No implementation details leaked into specifications
- [ ] Complexity justified if unavoidable

## Governance

This constitution supersedes all other development practices. When conflicts arise,
constitution principles take precedence.

### Amendment Procedure

Constitution amendments require:

1. Documented rationale for change
2. Impact analysis on existing templates and commands
3. Migration plan for in-flight features
4. Version bump following semantic versioning:
   - **MAJOR**: Backward-incompatible governance/principle changes
   - **MINOR**: New principles or materially expanded guidance
   - **PATCH**: Clarifications, wording fixes, non-semantic refinements
5. Approval from project maintainers
6. Sync of all dependent templates and command files

### Compliance

All commands, templates, and agents MUST enforce constitution rules. Non-compliance is
a bug that requires immediate correction.

Complexity that violates simplicity principles MUST be documented in plan.md
Complexity Tracking table with clear justification.

### Agent Development Guidance

Agents performing Specify framework tasks MUST:

- Follow command workflows exactly as specified
- Enforce quality gates without human override
- Output structured artifacts matching templates
- Update agent context files when adding technology
- Reference constitution when making decisions
- Fail fast on gate violations rather than proceeding

For runtime development guidance specific to AI agents, see the agent-specific context
files (e.g., `.specify/memory/agent-claude.md` for Claude Code).

**Version**: 1.0.0 | **Ratified**: 2026-02-11 | **Last Amended**: 2026-02-11
