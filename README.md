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

## ⚡ Highlights

- **⚡ Sub-50ms Real-Time DNS Checking**: Direct parallel queries to Cloudflare DNS over HTTPS (`1.1.1.1`) and Google DNS (`8.8.8.8`) — zero rate limits, zero false positives.
- **🎯 Semantic Brand Generation**: Smart keyword thesaurus automatically derives synonyms, metaphors, and high-recall compound startup names.
- **💰 Live Registrar Price Comparison**: Compare real-time prices across **Porkbun**, **Dynadot**, **Namecheap**, **Hostinger**, and **GoDaddy** in 1 click.
- **🎨 Minimal Split-Screen Interface**: Clean White & Blue aesthetic with distraction-free results and zero clutter.
- **⭐ Saved Shortlist**: Bookmark candidate domains with persistent local storage and personal notes.
- **🛡️ 100% Free & Open Source**: Zero subscription paywalls, no tracking, and no rate limits.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18.18 or later
- npm, pnpm, or yarn

### 1. Clone the repository
```bash
git clone https://github.com/29Sandesh/domain-hunter.git
cd domain-hunter
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
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

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more information.

---

<div align="center">
Built with ❤️ by <a href="https://github.com/29Sandesh">Sandesh Agrawal</a>
</div>
