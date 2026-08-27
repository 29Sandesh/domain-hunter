<div align="center">

# 🌐 DomainHunter

### **The Open-Source, Real-Time Domain Finder & Registrar Price Comparator.**

Find available `.com`, `.ai`, and `.io` domains in sub-50 milliseconds using Cloudflare DNS-over-HTTPS. Zero paid APIs, zero subscriptions, zero tracking.

<br />

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-10b981?style=for-the-badge)](./LICENSE)

<br />

[![GitHub Stars](https://img.shields.io/github/stars/29Sandesh/domain-hunter?style=social)](https://github.com/29Sandesh/domain-hunter/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/29Sandesh/domain-hunter?style=social)](https://github.com/29Sandesh/domain-hunter/network/members)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F29Sandesh%2Fdomain-hunter)

</div>

---

## ⚡ 1-Command Instant Start

Launch **DomainHunter** locally with a single terminal command:

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

The app will instantly launch at **`http://localhost:3000`**!

---

## 🚀 Why DomainHunter?

Most domain finders either charge expensive monthly subscriptions, bombard you with upsells, require API keys, or even **front-run your searches** (registering domains you looked up).

DomainHunter is built differently:

| Feature | 🌐 DomainHunter | 🏢 GoDaddy / Namecheap | 🤖 Other AI Generators |
| :--- | :---: | :---: | :---: |
| **100% Free & Open Source** | ✅ **Yes** | ❌ No | ❌ Freemium / Paid |
| **Zero API Keys Required** | ✅ **Yes (Runs Locally)** | ❌ N/A | ❌ Needs OpenAI API Key |
| **Sub-50ms DNS Resolution** | ✅ **Yes (Cloudflare DoH)** | ❌ Slow | ❌ Slow |
| **No Search Tracking / Sniping** | ✅ **100% Private** | ⚠️ Questionable | ⚠️ Logs Queries |
| **Live Registrar Price Comparison** | ✅ **Porkbun, Dynadot, Namecheap, GoDaddy** | ❌ Own Prices Only | ❌ No Price Data |
| **1-Click Self-Hostable** | ✅ **Yes (1-Command)** | ❌ No | ❌ No |

---

## ✨ Core Features

- **⚡ Sub-50ms Real-Time DNS Checking**: Direct parallel queries to Cloudflare DNS over HTTPS (`1.1.1.1`) and Google DNS (`8.8.8.8`) — zero rate limits, zero false positives.
- **🎯 Semantic Brand Ideation**: Local semantic thesaurus pairs your keywords with high-recall startup naming formulas (action compounds, evocative metaphors, authority hubs).
- **💰 Live Registrar Price Comparison**: Compare real-time prices across **Porkbun**, **Dynadot**, **Namecheap**, **Hostinger**, and **GoDaddy** in 1 click.
- **🎨 Minimal Split-Screen Dashboard**: Clean White & Blue modern design with responsive layout and distraction-free results.
- **⭐ Saved Shortlist**: Bookmark candidate domains with persistent browser storage and personal notes.
- **🛡️ 100% Private**: Your search queries never leave your browser/server. Zero domain front-running.

---

## 📂 Ultra-Lean Architecture (9 Core Files)

```text
├── app/
│   ├── api/domains/check/route.ts     # Real-time DNS check & price lookup API
│   ├── api/domains/generate/route.ts  # Batch candidate generation & parallel scan
│   ├── globals.css                    # Clean White & Blue styling
│   ├── layout.tsx                     # Root layout
│   └── page.tsx                       # Split-screen responsive dashboard
├── components/
│   ├── DomainCard.tsx                 # Clean domain row with 1-click buy & pricing
│   ├── DomainSearchInput.tsx          # Single search bar & extension chips
│   ├── Header.tsx                     # Minimal navigation & GitHub star link
│   └── ShortlistDrawer.tsx            # Slide-out saved bookmark drawer
├── lib/
│   ├── checker.ts                     # Sub-50ms Cloudflare DNS & registrar pricing
│   └── generator.ts                   # Semantic thesaurus & brand naming brain
├── bin/cli.js                         # NPX CLI runner
├── install.ps1                        # Windows 1-command installer
├── install.sh                         # macOS & Linux 1-command installer
└── package.json                       # Minimal zero-bloat dependencies
```

---

## 🛠️ Manual Installation

```bash
# 1. Clone the repository
git clone https://github.com/29Sandesh/domain-hunter.git

# 2. Enter directory & install dependencies
cd domain-hunter
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Reference

### 1. Single Domain Availability & Price Check
```http
GET /api/domains/check?domain=example.com
```

### 2. Batch Domain Generation & Live DNS Scan
```http
POST /api/domains/generate
```
```json
{
  "description": "B2B lead generation tool",
  "preferredTlds": [".com", ".ai"]
}
```

---

## ⭐ Star History

If you found DomainHunter helpful for finding your startup's next domain, please consider giving it a star! ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=29Sandesh/domain-hunter&type=Date)](https://star-history.com/#29Sandesh/domain-hunter&Date)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check out the [Issues page](https://github.com/29Sandesh/domain-hunter/issues).

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for details.

---

<div align="center">
Built with ❤️ by <a href="https://github.com/29Sandesh"><b>Sandesh Agrawal</b></a>
</div>
