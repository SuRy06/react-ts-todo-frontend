# Copilot Instructions

## Project Overview

This is a **React 19 + TypeScript + Vite** project using modern ES2022 features. It's configured with strict TypeScript settings and follows Vite's Fast Refresh patterns.

## Tech Stack

- **Build Tool**: Vite 7.x with `@vitejs/plugin-react` (uses Babel for Fast Refresh)
- **Framework**: React 19.2 with TypeScript 5.9
- **Module System**: ESNext with bundler resolution
- **Linting**: ESLint 9 (flat config) with TypeScript ESLint, React Hooks, and React Refresh plugins

## Key Configuration Patterns

### TypeScript Setup

The project uses a **composite TypeScript configuration**:

- [tsconfig.json](tsconfig.json) - Root config with project references
- [tsconfig.app.json](tsconfig.app.json) - App source configuration (strict mode, bundler resolution)
- [tsconfig.node.json](tsconfig.node.json) - Node/build tool configuration

**Important compiler options in use**:

- `verbatimModuleSyntax: true` - Import/export syntax must match runtime behavior
- `allowImportingTsExtensions: true` - Can import `.ts`/`.tsx` files in source
- `noEmit: true` - TypeScript only for type-checking; Vite handles transpilation
- `jsx: "react-jsx"` - Uses automatic JSX runtime (no need to import React in components)

### ESLint Configuration

Uses **ESLint 9 flat config** ([eslint.config.js](eslint.config.js)):

- Ignores `dist` directory via `globalIgnores`
- Applies to `**/*.{ts,tsx}` files only
- Includes React Hooks rules and React Refresh validation
- Browser globals configured

## Development Workflows

### Available Scripts

```bash
npm run dev      # Start dev server with HMR (http://localhost:5173)
npm run build    # Type-check with tsc -b, then build with Vite
npm run lint     # Run ESLint on all files
npm run preview  # Preview production build locally
```

**Build process**: Always runs `tsc -b` (build mode) before Vite build to ensure type safety.

## Code Patterns & Conventions

### Component Structure

- **Entry point**: [src/main.tsx](src/main.tsx) renders into `#root` element with `StrictMode`
- **Function components**: Use arrow functions or function declarations (see [App.tsx](src/App.tsx))
- **Hooks**: Import from `react` directly (`useState`, `useEffect`, etc.)
- **JSX**: Automatic runtime - no need to import React

### Styling

- **CSS Modules**: Not currently configured; uses plain CSS files
- **Global styles**: [src/index.css](src/index.css) - includes CSS variables in `:root`, dark/light mode support
- **Component styles**: Co-located CSS files (e.g., [App.css](src/App.css))
- **Design system**: Uses CSS custom properties with `prefers-color-scheme` media queries

### File Organization

```
src/
  main.tsx          # Application entry point
  App.tsx           # Root component
  App.css           # Component-specific styles
  index.css         # Global styles with theme variables
  assets/           # Static assets (images, SVGs)
```

## Important Constraints

1. **No React Compiler**: Not enabled due to dev/build performance considerations
2. **Type-aware linting**: Not enabled by default (can be added with `recommendedTypeChecked`)
3. **Strict mode**: All strict TypeScript checks enabled, including `noUnusedLocals` and `noUnusedParameters`
4. **Module imports**: When adding files, use `.tsx` extension for JSX and `.ts` for non-JSX TypeScript

## When Adding New Features

- Place new components in `src/` directory
- Create co-located CSS files for component-specific styles
- Use TypeScript's strict types - avoid `any`
- Follow React Hooks ESLint rules (dependencies arrays are required)
- Ensure Fast Refresh compatibility (export components, avoid anonymous exports)
