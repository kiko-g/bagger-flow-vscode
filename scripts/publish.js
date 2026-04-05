#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

const PKG_PATH = path.join(__dirname, "../package.json")
const ROOT = path.join(__dirname, "..")

function hasUncommittedChanges(file) {
  try {
    const status = execSync(`git status --porcelain "${file}"`, { cwd: ROOT, encoding: "utf-8" }).trim()
    return status.length > 0
  } catch {
    return false
  }
}

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
    console.error(`Version ${newVersion} is not higher than current ${currentVersion}. Aborting.`)
    process.exit(1)
  }

  // Preflight: ensure README and CHANGELOG were updated
  const readmeDirty = hasUncommittedChanges("README.md")
  const changelogDirty = hasUncommittedChanges("CHANGELOG.md")
  const missing = []
  if (!readmeDirty) missing.push("README.md")
  if (!changelogDirty) missing.push("CHANGELOG.md")

  if (missing.length > 0) {
    console.error(`\nPreflight failed — the following files have no uncommitted changes:`)
    missing.forEach((f) => console.error(`  - ${f}`))
    console.error(`\nUpdate them before publishing. Use --force to skip this check.`)
    if (!process.argv.includes("--force")) process.exit(1)
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
  try {
    execSync(`ovsx publish ${vsixFile} -p $OVSX_PAT`, { stdio: "inherit" })
  } catch (err) {
    console.warn(`\n⚠️  Open VSX publish failed (VS Code Marketplace succeeded). Error:\n  ${err.message}`)
  }

  console.log(`\nSuccessfully published v${newVersion}`)
}

main()
