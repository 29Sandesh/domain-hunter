<div align="center">

# 🌐 DomainHunter

**Discover high-recall brand domains with instant, real-time availability and live registrar price comparisons.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

[**Live Demo**](https://github.com/29Sandesh/domain-hunter) • [**Report Bug**](https://github.com/29Sandesh/domain-hunter/issues) • [**Request Feature**](https://github.com/29Sandesh/domain-hunter/issues)

</div>

---

## ⚡ 1-Command Instant Start

You can download, install, and run **DomainHunter** with a **single command**:

### 🪟 Windows (PowerShell)
```powershell
iwr -useb https://raw.githubusercontent.com/29Sandesh/domain-hunter/main/install.ps1 | iex
```

### 🍎 macOS & 🐧 Linux (Terminal)
```bash
curl -fsSL https://raw.githubusercontent.com/29Sandesh/domain-hunter/main/install.sh | bash
```

### 📦 Or using npx
```bash
npx degit 29Sandesh/domain-hunter domain-hunter && cd domain-hunter && npm install && npm run dev
```

Your app will automatically start at **`http://localhost:3000`**!

---

## ✨ Features

- **⚡ Sub-50ms Real-Time DNS Checking**: Direct parallel queries to Cloudflare DNS over HTTPS (`1.1.1.1`) and Google DNS (`8.8.8.8`) — zero rate limits, zero false positives.
- **🎯 Semantic Brand Generation**: Smart keyword thesaurus automatically derives synonyms, metaphors, and high-recall compound startup names.
- **💰 Live Registrar Price Comparison**: Compare real-time prices across **Porkbun**, **Dynadot**, **Namecheap**, **Hostinger**, and **GoDaddy** in 1 click.
- **🎨 Minimal Split-Screen Interface**: Clean White & Blue aesthetic with distraction-free results and zero clutter.
- **⭐ Saved Shortlist**: Bookmark candidate domains with persistent local storage and personal notes.
- **🛡️ 100% Free & Open Source**: Zero subscription paywalls, no tracking, and no rate limits.

---

## 🛠️ Manual Installation

If you prefer standard Git setup:

```bash
# 1. Clone the repository
git clone https://github.com/29Sandesh/domain-hunter.git

# 2. Enter project directory
cd domain-hunter

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router, Server Components) |
| **Frontend** | [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **DNS Engine** | Cloudflare DoH (`cloudflare-dns.com`), Google DoH (`dns.google`) |
| **Type Safety** | [TypeScript](https://www.typescriptlang.org/) (Strict Mode) |

---

## 📡 API Reference

### 1. Single Domain Check
```http
GET /api/domains/check?domain=example.com
```
**Response**:
```json
{
  "domain": "example.com",
  "name": "example",
  "tld": ".com",
  "isAvailable": false,
  "status": "TAKEN",
  "nameservers": ["a.iana-servers.net", "b.iana-servers.net"],
  "checkTimeMs": 42
}
```

### 2. Generate & Live-Verify Domains
```http
POST /api/domains/generate
```
**Payload**:
```json
{
  "description": "B2B Cold Outreach Tool",
  "preferredTlds": [".com"]
}
```

---

## 🤝 Contributing

Contributions are always welcome! Check out the [Contributing Guidelines](./CONTRIBUTING.md) to get started.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more information.

---

<div align="center">
Built with ❤️ by <a href="https://github.com/29Sandesh">Sandesh Agrawal</a>
</div>
