# Requirements Document

## Introduction

Refactor the Bagger Flow theme generation architecture to make the base theme's role as an immutable source of truth explicit, promote navy blue from a silent mirror copy to a proper variant, and extend the palette system to support per-variant foreground and syntax highlighting color overrides — not just UI/chrome colors.

## Glossary

- **Base_Theme**: The immutable source-of-truth JSON file (`bagger-flow-dark-base.json`) containing all default color values for both UI/chrome and syntax highlighting. This file is never shipped as a selectable theme.
- **Generation_Script**: The Node.js script (`scripts/generate-themes.js`) that reads the Base_Theme and produces all variant theme JSON files via palette substitution.
- **Variant**: A generated theme JSON file produced by the Generation_Script, each with its own palette of color overrides applied to the Base_Theme.
- **UI_Palette**: The set of color keys controlling editor chrome, backgrounds, borders, scrollbars, and accent colors (the current `BASE_COLORS` keys).
- **Syntax_Palette**: A new set of color keys controlling foreground and syntax highlighting colors used in `tokenColors` and `semanticTokenColors` sections.
- **Palette**: The combined set of UI_Palette keys and Syntax_Palette keys that a Variant may override.
- **VARIANTS_Object**: The JavaScript object in the Generation_Script that maps variant identifiers to their label, output filename, and Palette overrides.

## Requirements

### Requirement 1: Rename Base Theme File

**User Story:** As a theme maintainer, I want the base theme file named to reflect its role as an immutable source of truth, so that contributors do not confuse it with a user-facing theme.

#### Acceptance Criteria

1. WHEN the Generation_Script reads the source-of-truth file, THE Generation_Script SHALL read from `themes/bagger-flow-dark-base.json`.
2. THE Base_Theme file SHALL NOT appear as a selectable theme in the `contributes.themes` array of `package.json`.
3. WHEN the Base_Theme file is renamed, THE Generation_Script SHALL update the `BASE_THEME` constant to reference the new filename `bagger-flow-dark-base.json`.

### Requirement 2: Navy Blue as Explicit Variant

**User Story:** As a theme maintainer, I want navy blue to be a proper variant in the VARIANTS_Object with its own palette, so that it can be customized independently rather than being a silent verbatim copy.

#### Acceptance Criteria

1. THE Generation_Script SHALL include a `navy-blue` entry in the VARIANTS_Object with its own label, output filename, and Palette values.
2. WHEN the `navy-blue` Variant palette values match the Base_Theme defaults, THE Generation_Script SHALL produce output identical to the current `bagger-flow-dark--navy-blue.json`.
3. THE Generation_Script SHALL remove the dedicated mirror-copy logic that previously wrote the navy blue file verbatim from the Base_Theme.
4. THE `package.json` `contributes.themes` array SHALL retain the existing navy blue entry pointing to `themes/bagger-flow-dark--navy-blue.json` with label `Bagger Flow`.

### Requirement 3: Syntax Palette Keys

**User Story:** As a theme maintainer, I want the palette system to include foreground and syntax highlighting color keys, so that each variant can override syntax colors independently of UI/chrome colors.

#### Acceptance Criteria

1. THE Generation_Script SHALL define Syntax_Palette keys in `BASE_COLORS` representing the foreground colors used in the Base_Theme's `tokenColors` section.
2. WHEN a Variant specifies a Syntax_Palette key override, THE Generation_Script SHALL substitute that color in the generated theme's `tokenColors` and `semanticTokenColors` sections.
3. WHEN a Variant omits a Syntax_Palette key, THE Generation_Script SHALL use the Base_Theme default value for that key.
4. THE Generation_Script SHALL apply Syntax_Palette substitutions using the same find-and-replace mechanism used for UI_Palette substitutions.
5. IF a Syntax_Palette substitution produces an 8-digit hex foreground in a syntax scope, THEN THE Generation_Script SHALL reject the output with a descriptive error.

### Requirement 4: Palette Completeness Validation

**User Story:** As a theme maintainer, I want the generation script to validate that every variant defines all required palette keys, so that missing keys are caught before generating broken themes.

#### Acceptance Criteria

1. WHEN a Variant entry in the VARIANTS_Object omits a key present in `BASE_COLORS`, THE Generation_Script SHALL use the Base_Theme default value for that omitted key without error.
2. WHEN a Variant entry contains a key not present in `BASE_COLORS`, THE Generation_Script SHALL log a warning identifying the unknown key and the Variant name.

### Requirement 5: Update Package Manifest

**User Story:** As a theme maintainer, I want `package.json` to accurately reflect the new file structure, so that VS Code loads themes from the correct paths.

#### Acceptance Criteria

1. THE `package.json` `contributes.themes` array SHALL NOT reference `bagger-flow-dark-classic.json`.
2. THE `package.json` `contributes.themes` array SHALL reference `bagger-flow-dark--navy-blue.json` as the default theme with label `Bagger Flow`.
3. WHEN a new Variant is added to the VARIANTS_Object, THE `package.json` `contributes.themes` array SHALL include a corresponding entry with the Variant label and output path.

### Requirement 6: Update Steering Documentation

**User Story:** As a theme maintainer, I want the steering documents to reflect the new architecture, so that future contributors understand the updated file roles and palette system.

#### Acceptance Criteria

1. WHEN the refactor is complete, THE steering documents SHALL reference `bagger-flow-dark-base.json` as the source-of-truth file instead of `bagger-flow-dark-classic.json`.
2. THE steering documents SHALL describe the Syntax_Palette as part of the palette system alongside the UI_Palette.
3. THE steering documents SHALL list navy blue as a generated Variant rather than a mirror copy.
