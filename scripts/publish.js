#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

const PKG_PATH = path.join(__dirname, "../package.json")

function parseVersion(str) {
  const parts = str.split(".").map(Number)
  if (parts.length !== 3 || parts.some(isNaN)) {
    return null
  }
  return parts
}

function isHigher([aMaj, aMin, aPat], [bMaj, bMin, bPat]) {
  if (aMaj !== bMaj) return aMaj > bMaj
  if (aMin !== bMin) return aMin > bMin
  return aPat > bPat
}

function main() {
  const newVersion = process.argv[2]
  if (!newVersion) {
    console.error("Usage: node scripts/publish.js <new-version>")
    console.error("Example: node scripts/publish.js 0.2.0")
    process.exit(1)
  }

  const newParts = parseVersion(newVersion)
  if (!newParts) {
    console.error(`Invalid version format: "${newVersion}". Expected MAJOR.MINOR.PATCH (e.g. 0.2.0)`)
    process.exit(1)
  }

  const pkg = JSON.parse(fs.readFileSync(PKG_PATH, "utf-8"))
  const currentVersion = pkg.version
  const currentParts = parseVersion(currentVersion)

  if (!isHigher(newParts, currentParts)) {
    console.error(
      `Version ${newVersion} is not higher than current ${currentVersion}. Aborting.`
    )
    process.exit(1)
  }

  console.log(`Bumping version: ${currentVersion} -> ${newVersion}`)
  pkg.version = newVersion
  fs.writeFileSync(PKG_PATH, JSON.stringify(pkg, null, 2) + "\n", "utf-8")

  console.log("Running generate...")
  execSync("npm run generate", { stdio: "inherit" })

  console.log("Packaging .vsix...")
  execSync("vsce package", { stdio: "inherit" })

  const vsixFile = `bagger-flow-${newVersion}.vsix`
  console.log(`Publishing ${vsixFile} to VS Code Marketplace...`)
  execSync(`vsce publish -p $VSCE_PAT`, { stdio: "inherit" })

  console.log(`Publishing ${vsixFile} to Open VSX...`)
  execSync(`ovsx publish ${vsixFile} -p $OVSX_PAT`, { stdio: "inherit" })

  console.log(`\nSuccessfully published v${newVersion}`)
}

main()
