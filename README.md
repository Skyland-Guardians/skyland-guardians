# 🏰 Skyland Guardians - Family Finance Education Game

> **Legacy Guardians – Family Wealth Academy**
> A zero-risk investment simulation helping teens (12–18) learn portfolio management, risk control and asset allocation.

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-blue?style=flat-square)](https://Skyland-Guardians.github.io/skyland-guardians/)
[![React](https://img.shields.io/badge/React-19.1.1-blue?style=flat-square)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=flat-square)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.2-purple?style=flat-square)](https://vitejs.dev/)

**Looking for the Chinese README? [中文说明](README.zh-CN.md)**

## 🎯 Overview
Skyland Guardians is an educational game that turns family finance into an adventure. Players manage virtual assets, respond to market events and collaborate with parents to rebuild floating islands.

### 🌟 Highlights
- **🎮 Risk‑free simulation** – real market data with no real money involved.
- **👨‍👩‍👧‍👦 Family mode** – parents set boundaries, kids explore safely.
- **🤖 AI coach** – friendly companion explaining financial ideas.
- **🏆 Gamified learning** – missions, badges and levels keep motivation high.

### 🎲 World Setting
- **Legendary Skyland** – a realm symbolising wisdom and wealth.
- **Seven Relics** – each maps to an asset class:
  - 🗡️ Agile Blade (Tech stocks/ETFs)
  - 🛡️ Shield of Stability (Bonds)
  - 🌱 Green Forest (ESG)
  - 🏛️ Golden Sanctum (Gold)
  - 💧 Stable Spring (Stablecoins)
  - ⛩️ Yield Shrine (Income assets)
  - 💎 Mystic Crystal (Crypto)

## 🏗️ Project Structure
```
skyland-guardians/
├── .github/workflows/          # GitHub Actions
│   └── deploy.yml              # Deployment pipeline
├── public/                     # Static assets
├── src/                        # Source code
│   ├── assets/                 # Game graphics
│   ├── components/             # React components
│   ├── docs/                   # Design documents & mockups
│   ├── rules/                  # Coding guidelines
│   └── ...                     # App entry files
├── package.json                # Dependencies & scripts
├── vite.config.ts              # Vite configuration
└── README.md                   # This file
```

### 📘 Design Docs
See [`src/docs`](src/docs/) for detailed specifications and prototypes:
- [`PRD.md`](src/docs/PRD.md) – product requirements
- [`EVENT_SYSTEM.md`](src/docs/EVENT_SYSTEM.md) – event flow
- `NuWealth – Legacy Guardians - 游戏设计及计划.md` – gameplay plan (Chinese)

## 🚀 Quick Start
```bash
# Clone
git clone https://github.com/Skyland-Guardians/skyland-guardians.git
cd skyland-guardians

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview
```

## 🎮 Core Loop
1. **🎯 Mission card** – draw objectives.
2. **⚖️ Asset allocation** – distribute weights (total 100%).
3. **🌪️ Market simulation** – historical data plus random events.
4. **🤖 AI feedback** – observe → encourage → advise → question.
5. **🏆 Progress** – earn stars and restore the skyland.

## 🛠️ Tech Stack
- **React 19 + TypeScript 5**
- **Vite 7** for build tooling
- **Tailwind CSS 4** for styling
- **ESLint 9** for code quality
- **GitHub Pages** for deployment

## 🌐 Deployment
- **Live site**: https://Skyland-Guardians.github.io/skyland-guardians/
- Pushing to `master` triggers automatic build & deploy via GitHub Actions.

## 🤝 Contributing
1. Fork the repo and create a feature branch.
2. Run `npm run lint` and `npm run build` before committing.
3. Open a pull request describing your changes.

## 📄 License
This project is licensed under the **Creative Commons Attribution‑NonCommercial 4.0 International** license. See [LICENSE](LICENSE) for details.

## 📞 Contact
- Repo: https://github.com/Skyland-Guardians/skyland-guardians
- Issues: https://github.com/Skyland-Guardians/skyland-guardians/issues
- Discussions: https://github.com/Skyland-Guardians/skyland-guardians/discussions

---
**Note:** All investment scenarios are fictional and for educational purposes only.

