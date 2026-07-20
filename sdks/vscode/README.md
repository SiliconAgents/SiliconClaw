# SCLAW VS Code Extension

A Visual Studio Code extension that integrates [SCLAW](https://github.com/anomalyco/opencode) directly into your development workflow.

## Prerequisites

Install the SCLAW CLI and ensure `sclaw` is on your `PATH`:

```bash
cd packages/opencode
bun link
```

## Features

- **Quick Launch**: `Cmd+Esc` (Mac) or `Ctrl+Esc` (Windows/Linux) — open SCLAW in a split terminal, or focus an existing session.
- **New Session**: `Cmd+Shift+Esc` / `Ctrl+Shift+Esc` — start a new SCLAW terminal session.
- **Context Awareness**: Share your current selection or tab with SCLAW automatically.
- **File Reference Shortcuts**: `Cmd+Option+K` (Mac) or `Alt+Ctrl+K` (Linux/Windows) to insert `@File#L37-42` references.

## Development

1. `code sdks/vscode` — Open the `sdks/vscode` directory in VS Code. **Do not open from repo root.**
2. `bun install` — Run inside `sdks/vscode`.
3. Press `F5` to start debugging — launches a new VS Code window with the extension loaded.

Ensure `sclaw` is on your `PATH` in the debug window (e.g. `bun link` from `packages/opencode`).

### Making Changes

`tsc` and `esbuild` watchers run automatically during debugging. To reload:

1. In the debug VS Code window, press `Cmd+Shift+P`
2. **Developer: Reload Window**

## Support

Report issues in your SCLAW fork repository.
