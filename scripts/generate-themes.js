const fs = require("fs")
const path = require("path")

const THEMES_DIR = path.join(__dirname, "../themes")
/** Canonical default palette — edit this file, then run `npm run generate`. */
const BASE_THEME = path.join(THEMES_DIR, "bagger-flow-dark-classic.json")
const NAVY_MIRROR = path.join(THEMES_DIR, "bagger-flow-dark--navy-blue.json")

const BASE_COLORS = {
  accent: "#1479b8",
  accentAlt: "#247bce",
  chromeBg: "#14171c",
  editorBg: "#161b23",
  miscBg: "#161b22",
  border: "#30363d",
  secondaryBg: "#21262d",
  highlight: "#153051",
  deepestBg: "#101318",
  statusBg: "#101016",
  widgetBg: "#1f242b",
  emptyBg: "#242730",
  scrollbarMuted: "#bec7da" /** Scrollbar thumb tint in #RRGGBB14 / #RRGGBB24 */,
  overviewRulerBg: "#12171e" /** Minimap / overview-ruler gutter strip (solid) */,
}

const VARIANTS = {
  "gray-slate": {
    label: "Bagger Flow Dark -- Charcoal Gray",
    output: "bagger-flow-dark--charcoal-gray.json",
    colors: {
      accent: "#313a4e",
      accentAlt: "#5f687c",
      chromeBg: "#18181b",
      editorBg: "#1c1c1f",
      miscBg: "#1a1a1d",
      border: "#3f3f46",
      secondaryBg: "#27272a",
      highlight: "#2c2c31",
      deepestBg: "#111113",
      statusBg: "#09090b",
      widgetBg: "#232326",
      emptyBg: "#202023",
      scrollbarMuted: "#a1a1aa",
      overviewRulerBg: "#1a1a1d",
    },
  },
  "cherry-rose": {
    label: "Bagger Flow Dark -- Cherry Rose",
    output: "bagger-flow-dark--cherry-rose.json",
    colors: {
      accent: "#e11d48",
      accentAlt: "#f43f5e",
      chromeBg: "#1a0c10",
      editorBg: "#1d1214",
      miscBg: "#1c0e12",
      border: "#4c2530",
      secondaryBg: "#2a151c",
      highlight: "#3d1822",
      deepestBg: "#12090c",
      statusBg: "#0a0508",
      widgetBg: "#28141a",
      emptyBg: "#221216",
      scrollbarMuted: "#d4a8b8",
      overviewRulerBg: "#1c0e12",
    },
  },
  "teal-mint": {
    label: "Bagger Flow Dark -- Mint Teal",
    output: "bagger-flow-dark--mint-teal.json",
    colors: {
      accent: "#0a8b71",
      accentAlt: "#14b8a6",
      chromeBg: "#0e1615",
      editorBg: "#101b19",
      miscBg: "#101b19",
      border: "#2a3f3c",
      secondaryBg: "#1a2c29",
      highlight: "#0f3a35",
      deepestBg: "#0a1210",
      statusBg: "#080e0d",
      widgetBg: "#162623",
      emptyBg: "#132220",
      scrollbarMuted: "#7dd3c8",
      overviewRulerBg: "#101b19",
    },
  },
  "petrol-neon": {
    label: "Bagger Flow Dark -- Petrol Neon",
    output: "bagger-flow-dark--petrol-neon.json",
    colors: {
      accent: "#5d42b7",
      accentAlt: "#5c4b93",
      chromeBg: "#0a0e11",
      editorBg: "#0c1115",
      miscBg: "#0b1014",
      border: "#1c3040",
      secondaryBg: "#111a22",
      highlight: "#0c2a3d",
      deepestBg: "#07090c",
      statusBg: "#050709",
      widgetBg: "#10181f",
      emptyBg: "#0e151b",
      scrollbarMuted: "#67b8d6",
      overviewRulerBg: "#0b1014",
    },
  },
}

/** In VS Code, #RRGGBBAA in syntax scopes makes text nearly invisible — UI *.foreground may still use alpha. */
const SYNTAX_MARKERS = ['"tokenColors":', '"semanticTokenColors":']
const FOREGROUND_8_HEX = /"foreground"\s*:\s*"#([0-9a-fA-F]{8})"/g

function assertOpaqueSyntaxForegrounds(fileLabel, content) {
  const bad = []
  for (const marker of SYNTAX_MARKERS) {
    const i = content.indexOf(marker)
    if (i === -1) continue
    const tail = content.slice(i)
    for (const m of tail.matchAll(FOREGROUND_8_HEX)) {
      bad.push(m[0])
    }
  }
  if (bad.length > 0) {
    throw new Error(
      `${fileLabel}: syntax highlighting must not use 8-digit hex foregrounds (alpha). Found:\n  ${bad.join("\n  ")}`,
    )
  }
}

/** Strip leading # if present so replacements match raw hex in the theme JSON. */
function bare(hex) {
  return hex.startsWith("#") ? hex.slice(1) : hex
}

function generate() {
  const baseContent = fs.readFileSync(BASE_THEME, "utf-8")
  assertOpaqueSyntaxForegrounds(path.basename(BASE_THEME), baseContent)

  fs.writeFileSync(NAVY_MIRROR, baseContent, "utf-8")
  console.log("Synced bagger-flow-dark--navy-blue.json from classic (default marketplace path)")

  for (const [variantKey, variant] of Object.entries(VARIANTS)) {
    let themed = baseContent

    for (const colorKey of Object.keys(BASE_COLORS)) {
      const from = bare(BASE_COLORS[colorKey])
      const to = bare(variant.colors[colorKey])
      themed = themed.replaceAll(from, to)
    }

    assertOpaqueSyntaxForegrounds(variant.output, themed)

    const outPath = path.join(THEMES_DIR, variant.output)
    fs.writeFileSync(outPath, themed, "utf-8")
    console.log(`Generated ${variant.label} -> ${variant.output}`)
  }
}

generate()
