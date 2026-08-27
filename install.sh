#!/usr/bin/env bash
set -e

echo -e "\n\033[1;36m🚀 Installing DomainHunter...\033[0m"

TARGET_DIR="domain-hunter"

if [ -d "$TARGET_DIR" ]; then
  echo -e "\033[1;33mFolder '$TARGET_DIR' already exists. Navigating inside...\033[0m"
else
  echo -e "📦 Cloning repository..."
  git clone https://github.com/29Sandesh/domain-hunter.git "$TARGET_DIR"
fi

cd "$TARGET_DIR"

echo -e "⚡ Installing dependencies..."
npm install

echo -e "\n\033[1;32m✨ Launching DomainHunter at http://localhost:3000...\033[0m\n"
npm run dev
