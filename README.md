<div align="center">

# 🌐 DomainHunter

**Discover high-recall brand domains with instant, real-time availability and live registrar price comparisons.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

</div>

---

## ⚡ 1-Command Quickstart

Run DomainHunter locally with a single terminal command:

### 🪟 Windows (PowerShell)
```powershell
iwr -useb https://raw.githubusercontent.com/29Sandesh/domain-hunter/main/install.ps1 | iex
```

### 🍎 macOS & 🐧 Linux (Terminal)
```bash
curl -fsSL https://raw.githubusercontent.com/29Sandesh/domain-hunter/main/install.sh | bash
```

### 📦 Or via NPX
```bash
npx degit 29Sandesh/domain-hunter domain-hunter && cd domain-hunter && npm install && npm run dev
```

App will automatically start at **`http://localhost:3000`**!

---

## ✨ Features

- **⚡ Sub-50ms Real-Time DNS Checking**: Direct parallel queries to Cloudflare DNS over HTTPS (`1.1.1.1`) and Google DNS (`8.8.8.8`) — zero rate limits, zero false positives.
- **🎯 Semantic Brand Generation**: Smart keyword thesaurus automatically derives synonyms, metaphors, and high-recall compound startup names.
- **💰 Live Registrar Price Comparison**: Compare real-time prices across **Porkbun**, **Dynadot**, **Namecheap**, **Hostinger**, and **GoDaddy** in 1 click.
- **🎨 Minimal Split-Screen Interface**: Clean White & Blue aesthetic with distraction-free results and zero clutter.
- **⭐ Saved Shortlist**: Bookmark candidate domains with persistent local storage and personal notes.
- **🛡️ 100% Free & Open Source**: Zero subscription paywalls, no tracking, and no rate limits.

---

## 📂 Minimal Codebase Architecture

```text
├── app/
│   ├── api/domains/       # Sub-50ms DNS check & generation API routes
│   ├── globals.css        # Clean minimal White & Blue styling
│   ├── layout.tsx         # Root layout & typography
│   └── page.tsx           # Split-screen responsive dashboard
├── components/
│   ├── DomainCard.tsx     # Clean domain row with 1-click buy & pricing
│   ├── DomainSearchInput.tsx # Unified search & extension selector
│   ├── Header.tsx         # Minimal top navigation & GitHub link
│   └── ShortlistDrawer.tsx # Bookmark slide-out drawer
├── lib/
│   ├── checker.ts         # Fast DNS-over-HTTPS & registrar pricing
│   └── generator.ts       # Semantic thesaurus & naming brain
├── bin/cli.js             # NPX launcher script
├── install.ps1            # Windows 1-command installer
├── install.sh             # macOS / Linux 1-command installer
└── package.json           # Minimal dependencies
```

---

## 🛠️ Manual Installation

```bash
# 1. Clone repository
git clone https://github.com/29Sandesh/domain-hunter.git

# 2. Enter directory & install
cd domain-hunter
npm install

# 3. Start local server
npm run dev
```

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for details.

---

<div align="center">
Built with ❤️ by <a href="https://github.com/29Sandesh">Sandesh Agrawal</a>
</div>
