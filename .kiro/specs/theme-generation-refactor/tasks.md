# Implementation Plan: Theme Generation Refactor

## Overview

Refactor the theme generation pipeline to rename the base theme file, promote navy blue to a proper variant, expand the palette with syntax keys, add unknown-key warnings, update package.json, update steering docs, and add tests. Each task builds incrementally on the previous one so the script stays runnable throughout.

## Tasks

- [ ] 1. Rename base theme file and update script constant
  - [ ] 1.1 Rename `themes/bagger-flow-dark-classic.json` to `themes/bagger-flow-dark-base.json`
    - Use `fs.renameSync` or git mv to rename the file
    - _Requirements: 1.1, 1.3_
  - [ ] 1.2 Update `BASE_THEME` constant in `scripts/generate-themes.js` to reference `bagger-flow-dark-base.json`
    - Change the filename string in the `path.join` call
    - _Requirements: 1.1, 1.3_
  - [ ] 1.3 Remove `NAVY_MIRROR` constant and the `fs.writeFileSync(NAVY_MIRROR, baseContent)` mirror-copy line
    - Delete the constant declaration and the verbatim copy logic in `generate()`
    - _Requirements: 2.3_

- [ ] 2. Add navy-blue as a proper variant and expand BASE_COLORS with syntax palette keys
  - [ ] 2.1 Add `navy-blue` entry to the `VARIANTS` object
    - Label: `"Bagger Flow"`, output: `"bagger-flow-dark--navy-blue.json"`, colors: `{}` (empty — uses base defaults)
    - Place it as the first entry in `VARIANTS`
    - _Requirements: 2.1, 2.2_
  - [ ] 2.2 Expand `BASE_COLORS` with syntax palette keys
    - Add the ~19 syntax keys from the design document (`syntaxVariable`, `syntaxComment`, `syntaxConstVar`, `syntaxConstant`, `syntaxNumber`, `syntaxUnit`, `syntaxTagPunctuation`, `syntaxString`, `syntaxKeyword`, `syntaxFunction`, `syntaxProperty`, `syntaxType`, `syntaxAltSymbol`, `syntaxCssVendor`, `syntaxBuiltinProp`, `syntaxComplementary`, `syntaxMarkupAlt`, `syntaxLiquidOutput`, `syntaxLiquidValue`)
    - Values must match the foreground hex values from the base theme's `tokenColors` section
    - Add a `// ── Syntax Palette ──` comment separator
    - _Requirements: 3.1_
  - [ ] 2.3 Implement palette merge with spread operator in the generation loop
    - Replace direct `BASE_COLORS[colorKey]` lookups with `const merged = { ...BASE_COLORS, ...variant.colors }` before the `replaceAll` loop
    - Iterate over `Object.keys(BASE_COLORS)` using `merged[colorKey]` as the target value
    - _Requirements: 3.2, 3.3, 4.1_
  - [ ] 2.4 Add unknown palette key warning logic
    - After merging, iterate `Object.keys(variant.colors)` and `console.warn` for any key not in `BASE_COLORS`
    - Warning message must include both the unknown key name and the variant name
    - _Requirements: 4.2_

- [ ] 3. Checkpoint
  - Run `npm run generate` and verify all variant files are produced correctly
  - Ensure navy-blue output is identical to the base theme content
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Update package.json and steering docs
  - [ ] 4.1 Remove classic theme reference from `package.json` `contributes.themes`
    - Ensure no entry references `bagger-flow-dark-classic.json`
    - The navy-blue entry with label `Bagger Flow` should already be present — verify it
    - _Requirements: 1.2, 5.1, 5.2_
  - [ ] 4.2 Add Petrol Blue variant entry to `package.json` if missing
    - Verify every `VARIANTS` entry has a matching `contributes.themes` entry
    - _Requirements: 5.3_
  - [ ] 4.3 Update `.kiro/steering/structure.md`
    - Replace `bagger-flow-dark-classic.json` references with `bagger-flow-dark-base.json`
    - Describe the base file as non-shipped source of truth
    - List navy blue as a generated variant, not a mirror copy
    - _Requirements: 6.1, 6.3_
  - [ ] 4.4 Update `.kiro/steering/tech.md`
    - Replace `bagger-flow-dark-classic.json` references with `bagger-flow-dark-base.json`
    - Update the generation flow description to mention syntax palette keys and palette merge
    - Remove mention of verbatim mirror copy for navy blue
    - _Requirements: 6.1, 6.2, 6.3_
  - [ ] 4.5 Update `.kiro/steering/product.md`
    - Replace `bagger-flow-dark-classic.json` reference with `bagger-flow-dark-base.json`
    - List navy blue as a generated variant
    - Mention syntax palette as part of the palette system
    - _Requirements: 6.1, 6.2, 6.3_

- [ ] 5. Checkpoint
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Add example-based tests with node:test
  - [ ] 6.1 Create `scripts/generate-themes.test.js` with unit tests
    - Test that `BASE_THEME` resolves to `bagger-flow-dark-base.json`
    - Test that `VARIANTS["navy-blue"]` exists with correct label, output, and empty colors
    - Test that generated navy-blue output equals base theme content
    - Test that the script source does not contain `NAVY_MIRROR`
    - Test that `package.json` `contributes.themes` does not reference `classic.json` and does reference `navy-blue.json` with label `Bagger Flow`
    - Test that every VARIANTS entry has a corresponding `contributes.themes` entry
    - Test that steering docs reference `base.json`, mention syntax palette, and describe navy blue as a variant
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 5.1, 5.2, 5.3, 6.1, 6.2, 6.3_
  - [ ]* 6.2 Write property-based tests with fast-check
    - **Property 1: Palette completeness covers all syntax foregrounds**
    - **Validates: Requirements 3.1**
  - [ ]* 6.3 Write property-based test for substitution correctness
    - **Property 2: Syntax palette substitution correctness**
    - **Validates: Requirements 3.2**
  - [ ]* 6.4 Write property-based test for default fallback
    - **Property 3: Omitted palette keys retain base defaults**
    - **Validates: Requirements 3.3, 4.1**
  - [ ]* 6.5 Write property-based test for 8-digit hex rejection
    - **Property 4: 8-digit hex syntax foreground rejection**
    - **Validates: Requirements 3.5**
  - [ ]* 6.6 Write property-based test for unknown key warning
    - **Property 5: Unknown palette key warning**
    - **Validates: Requirements 4.2**

- [ ] 7. Final checkpoint
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- The design uses JavaScript throughout, matching the existing `scripts/generate-themes.js`
- Property-based tests require `fast-check` as a dev dependency
- Example-based tests use `node:test` + `node:assert` (no external deps)
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
