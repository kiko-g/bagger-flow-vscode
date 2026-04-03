# Tech Stack

- **Platform**: VS Code Extension (Color Theme type)
- **Runtime**: Node.js (for theme generation script only — no runtime code in the extension itself)
- **Packaging**: `@vscode/vsce` for `.vsix` builds, `ovsx` for Open VSX publishing
- **Engine**: VS Code `^1.14.0`

## Common Commands

| Command | Description |
|---|---|
| `npm run generate` | Regenerate all variant themes from the classic base |
| `npm run build` | Generate themes + package `.vsix` |
| `npm run publish` | Build + publish to VS Code Marketplace and Open VSX |

## How Theme Generation Works

`scripts/generate-themes.js` reads `themes/bagger-flow-dark-classic.json` (the canonical source of truth), then:

1. Mirrors it verbatim to `bagger-flow-dark-navy.json` (the default marketplace entry).
2. For each variant (gray, cherry, teal), performs a find-and-replace of the `BASE_COLORS` palette with the variant's palette and writes the output JSON.
3. Validates that no syntax-scoped `tokenColors` or `semanticTokenColors` use 8-digit hex foregrounds (alpha), which would make text invisible.

After editing any theme colors, always run `npm run generate` to propagate changes.
