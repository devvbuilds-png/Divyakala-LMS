# ADR-002: Documentation Lives in the Repo, Not Obsidian

**Status:** Accepted
**Date:** 2026-05
**Decided by:** Dev

## Context

The project is built across multiple AI agents (Claude Code, Codex) and Claude chat sessions. Context and decisions were at risk of being scattered. Needed a single, reliable place for project documentation that survives across sessions.

## Decision

All project documentation lives in a `/docs` folder inside the project repo. Not in Obsidian, not in external tools.

## Why

- Claude Code and Codex both operate inside the project folder. Docs in the repo are readable and writable by both agents — they stay in sync automatically.
- Git provides version history for the docs for free.
- Documentation in an external tool (Obsidian) would be invisible to the coding agents.

## Alternatives Rejected

- **Obsidian vault** — good for human note-taking, but invisible to the AI coding agents that do most of the building. Defeats the purpose.
- **Scattered markdown files in root** — no structure, hard to navigate as the project grows.

## Consequences

- Every AI session must read `HANDOFF.md` and `claude.md` first, and update `claude.md` before ending.
- Docs are part of the build process, not separate paperwork.

## Related

- docs/README.md
