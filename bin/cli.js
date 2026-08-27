#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const targetDir = process.argv[2] || "domain-hunter";
const targetPath = path.resolve(process.cwd(), targetDir);

console.log(`\n🚀 Initializing DomainHunter in ./${targetDir}...\n`);

try {
  // Clone repository
  console.log("📦 Cloning repository from GitHub...");
  execSync(`git clone https://github.com/29Sandesh/domain-hunter.git "${targetPath}"`, {
    stdio: "inherit",
  });

  // Navigate and install
  console.log("\n⚡ Installing dependencies (npm install)...");
  execSync("npm install", {
    cwd: targetPath,
    stdio: "inherit",
  });

  console.log("\n✨ DomainHunter is ready!");
  console.log("\nTo start your local finder:");
  console.log(`  cd ${targetDir}`);
  console.log("  npm run dev\n");
  console.log("🌐 Open http://localhost:3000 in your browser.\n");
} catch (error) {
  console.error("\n❌ Setup failed:", error.message);
  process.exit(1);
}
