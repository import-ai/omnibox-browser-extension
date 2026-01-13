# DEVELOPER.md

This file provides guidance to developer when working with code in this repository.

## Build Commands

```bash
# Development
pnpm dev                # Chrome development with HMR
pnpm dev:firefox        # Firefox development
pnpm dev:safari         # Safari development

# Production builds
pnpm build              # Chrome production build
pnpm build:firefox      # Firefox production build
pnpm build:safari       # Safari production build (includes packaging)

# Packaging
pnpm zip                # Package Chrome build into ZIP
pnpm zip:firefox        # Package Firefox build into ZIP

# Code quality
pnpm lint               # Run ESLint
pnpm lint:fix           # ESLint with auto-fix
pnpm prettier           # Run Prettier
pnpm type-check         # TypeScript type checking

# Utilities
pnpm module-manager     # Enable/disable extension modules
pnpm update-version X.Y.Z  # Update all package versions
pnpm clean              # Full cleanup
pnpm clean:install      # Clean reinstall
```

## Dependencies

```bash
pnpm i <package> -w              # Install for root workspace
pnpm i <package> -F <module>     # Install for specific module (e.g., -F content-script)
```

## Architecture Overview

This is a browser extension monorepo using pnpm workspaces + Turborepo. It supports Chrome (MV3), Firefox (MV3), and Safari (MV2).

### Extension Components

- **Background** (`chrome-extension/src/background/`) - Service worker handling message routing, storage proxying, API calls, tab management
- **Content Script** (`pages/content/`) - Injected into web pages, renders React UI in Shadow DOM
- **Options Page** (`pages/options/`) - Settings UI with sections for common, toolbar, keyboard, and advanced settings
- **Popup** (`pages/popup/`) - Toolbar popup UI

### Shared Packages (`packages/`)

- `@extension/shared` - Core utilities: axios wrapper, tracking, types, React HOCs
- `@extension/storage` - Chrome storage abstraction
- `@extension/ui` - Reusable React components
- `@extension/i18n` - Internationalization (EN, ZH)
- `@extension/env` - Environment variable management

### Message Passing

All extension parts communicate via `chrome.runtime.sendMessage`. Key actions:
- `__ping__` / `__content_ready__` - Content script lifecycle
- `toggle-popup` - Toggle content script UI
- `collect` - Collect page data
- `storage` / `set-storage` / `remove-storage` - Storage operations
- `fetch` - Proxy fetch through background
- `track` - Analytics events

## Environment Variables

Prefix-based system:
- `CEB_*` - Static variables in `.env`
- `CLI_CEB_*` - CLI-provided (e.g., `CLI_CEB_DEV`, `CLI_CEB_FIREFOX`, `CLI_CEB_SAFARI`)

```bash
pnpm set-global-env CLI_CEB_DEV=true CLI_CEB_FIREFOX=false
```

Use `IS_DEV` from `@extension/env` for conditional logic.

## Key Files

- `chrome-extension/manifest.ts` - Generates manifest (V3 for Chrome/Firefox, V2 for Safari)
- `chrome-extension/src/background/index.ts` - Background script entry
- `pages/content/src/index.tsx` - Content script entry
- `packages/shared/lib/utils/shared-types.ts` - Core TypeScript interfaces

## Loading the Extension

**Chrome**: `chrome://extensions` → Developer mode → Load unpacked → select `dist/`

**Firefox**: `about:debugging#/runtime/this-firefox` → Load Temporary Add-on → select `dist/manifest.json`

## Project Conventions

- Node >= 22.12.0 required (see `.nvmrc`)
- Use pnpm (not npm)
- Prettier: 120 char width, single quotes, trailing commas, semicolons
- Content script builds to IIFE format for injection

## Git Commit Guidelines

**Format**: `type(scope): Description`

**Types**:

- `feat` - New features
- `fix` - Bug fixes
- `docs` - Documentation changes
- `style` - Styling changes
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Test additions or changes
- `chore` - Maintenance tasks
- `revert` - Revert previous commits
- `build` - Build system changes

**Rules**:

- Scope is required (e.g., `sidebar`, `tasks`, `auth`)
- Description in sentence case with capital first letter
- Use present tense action verbs (Add, Fix, Support, Update, Replace, Optimize)
- No period at the end
- Keep it concise and focused

**Examples**:

```
feat(apple): Support apple signin
fix(sidebar): Change the abnormal scrolling
chore(children): Optimize children api
refactor(tasks): Add timeout status
```

**Do NOT include**:

- "Generated with Claude Code" or similar attribution
- "Co-Authored-By: Claude" or any Claude co-author tags

