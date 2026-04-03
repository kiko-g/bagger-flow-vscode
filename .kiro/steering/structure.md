# Project Structure

```
themes/
  bagger-flow-dark-classic.json   # Canonical base theme (edit this one)
  bagger-flow-dark-navy.json      # Auto-generated mirror of classic (default in marketplace)
  bagger-flow-dark-gray.json      # Auto-generated variant
  bagger-flow-dark-cherry.json    # Auto-generated variant
  bagger-flow-dark-teal.json      # Auto-generated variant

scripts/
  generate-themes.js              # Theme generation script — palette swap + validation

trials/                           # Sample files for visually testing syntax highlighting
                                  # (css, html, js, ts, jsx, ruby, scss, liquid)

screenshots/                      # Marketplace and README screenshots
```

## Key Rules

- `bagger-flow-dark-classic.json` is the single source of truth. Never hand-edit the other theme JSON files — they are overwritten by `npm run generate`.
- New color palette keys must be added to both `BASE_COLORS` and every entry in `VARIANTS` inside `generate-themes.js`.
- Theme contributions are registered in `package.json` under `contributes.themes`. Add an entry there when introducing a new variant.
- The `trials/` folder is for manual visual QA — open these files with the theme active to verify highlighting.
- Always update `CHANGELOG.md` and `README.md` when publishing or making changes leading up to a publication.
