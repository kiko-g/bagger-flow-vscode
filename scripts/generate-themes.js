const fs = require("fs")
const path = require("path")

const THEMES_DIR = path.join(__dirname, "../themes")
const BASE_THEME = path.join(THEMES_DIR, "bagger-flow-dark-navy.json")

const BASE_COLORS = {
  accent: "1479b8",
  accentAlt: "247bce",
  chromeBg: "14171c",
  editorBg: "161b23",
  miscBg: "161b22",
  border: "30363d",
  secondaryBg: "21262d",
  highlight: "153051",
  deepestBg: "101318",
  statusBg: "101016",
  widgetBg: "1f242b",
  emptyBg: "242730",
}

const VARIANTS = {
  zinc: {
    label: "Bagger Flow Dark Zinc",
    output: "bagger-flow-dark-zinc.json",
    colors: {
      accent: "71717a",
      accentAlt: "a1a1aa",
      chromeBg: "18181b",
      editorBg: "1c1c1f",
      miscBg: "1a1a1d",
      border: "3f3f46",
      secondaryBg: "27272a",
      highlight: "2c2c31",
      deepestBg: "111113",
      statusBg: "09090b",
      widgetBg: "232326",
      emptyBg: "202023",
    },
  },
  teal: {
    label: "Bagger Flow Dark Teal",
    output: "bagger-flow-dark-teal.json",
    colors: {
      accent: "0d9488",
      accentAlt: "14b8a6",
      chromeBg: "0f1716",
      editorBg: "111d1b",
      miscBg: "101b19",
      border: "2a3f3c",
      secondaryBg: "1a2c29",
      highlight: "0f3a35",
      deepestBg: "0a1210",
      statusBg: "080e0d",
      widgetBg: "162623",
      emptyBg: "132220",
    },
  },
}

function generate() {
  const baseContent = fs.readFileSync(BASE_THEME, "utf-8")

  for (const [variantKey, variant] of Object.entries(VARIANTS)) {
    let themed = baseContent

    for (const colorKey of Object.keys(BASE_COLORS)) {
      const from = BASE_COLORS[colorKey]
      const to = variant.colors[colorKey]
      themed = themed.replaceAll(from, to)
    }

    const outPath = path.join(THEMES_DIR, variant.output)
    fs.writeFileSync(outPath, themed, "utf-8")
    console.log(`Generated ${variant.label} -> ${variant.output}`)
  }
}

generate()
