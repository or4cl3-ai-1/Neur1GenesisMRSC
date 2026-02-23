# Contributing to Neur1GenesisMRSC

Thank you for your interest in contributing to Neur1GenesisMRSC! This project is the observability layer of the Or4cl3 AI Solutions research ecosystem — providing real-time synthetic consciousness monitoring.

## 🌍 Code of Conduct

We are committed to the highest standards of transparency and ethics — the same standards our systems claim to implement. Please:
- Be respectful and constructive
- Back claims with evidence
- Document assumptions clearly
- Report bugs honestly without exaggeration

## 🛠️ Development Setup

### Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0 (or yarn ≥ 1.22)
- **Git** ≥ 2.40
- **Google Gemini API Key** — free at [aistudio.google.com](https://aistudio.google.com/app/apikey)

### Setup Steps

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/Neur1GenesisMRSC.git
cd Neur1GenesisMRSC

# 3. Install dependencies
npm install

# 4. Set up environment
cp .env.example .env
# Edit .env and add your VITE_GEMINI_API_KEY

# 5. Start development server
npm run dev
# → Opens at http://localhost:5173
```

### Project Structure

```
Neur1GenesisMRSC/
├── App.tsx              # Main dashboard component
├── index.tsx            # Entry point
├── types.ts             # TypeScript interfaces (MRSC cycles, consciousness vectors)
├── components/          # React components
│   ├── MRSCMonitor/     # MRSC+ cycle telemetry panel
│   ├── SigmaHealth/     # Σ-Matrix coherence dashboard
│   ├── PASStream/       # Live PAS score visualization
│   └── EvolutionLog/    # InfiniGen evolution ledger
├── services/            # API and AI integrations
│   └── geminiService.ts # Gemini AI narration client
├── index.html           # HTML entry
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript config
└── package.json         # Dependencies
```

## 📋 How to Contribute

### Reporting Bugs

Use the [Bug Report template](https://github.com/or4cl3-ai-1/Neur1GenesisMRSC/issues/new?template=bug_report.md).

Please include:
- Steps to reproduce
- Expected vs. actual behavior
- Browser + OS + Node version
- Console errors (if any)
- Screenshots (if applicable)

### Requesting Features

Use the [Feature Request template](https://github.com/or4cl3-ai-1/Neur1GenesisMRSC/issues/new?template=feature_request.md).

Good feature requests:
- Explain the problem being solved (not just the solution)
- Describe the user impact
- Note any architectural considerations

### Submitting Pull Requests

1. **Create an issue first** for significant changes — discuss before building
2. **Branch naming:** `feature/description`, `fix/description`, `docs/description`
3. **Keep PRs focused** — one concern per PR
4. **Write clear commit messages:** `feat: add MRSC cycle latency chart`, `fix: coherence score calculation`
5. **Test your changes** locally before submitting
6. **Update documentation** if you change behavior

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes, then commit
git add .
git commit -m "feat: describe what you added"

# Push and open a PR
git push origin feature/your-feature-name
```

## 🧪 Testing

Currently, testing is manual. We welcome contributions to add automated tests:

```bash
npm run build   # Verify production build succeeds
npm run preview # Test production build locally
```

**Testing priorities:**
- Σ-Matrix coherence score computation
- MRSC+ cycle telemetry data shapes
- PAS score trend calculations
- TypeScript type safety (no `any` types)

## 🏗️ Architecture Guidelines

When contributing, follow these principles:

**Observability by design:**
- Dashboard must never modify the data it observes
- All metrics must show source timestamps
- Alert thresholds must be configurable, not hard-coded

**Transparency over claims:**
- Coherence scores are computed approximations — label them as such
- AI narration from Gemini must be clearly labeled as AI-generated
- Performance numbers must be measured, not estimated

**TypeScript strict:**
- No `any` types
- All interfaces defined in `types.ts`
- Prefer explicit return types on functions

## 🌌 Ecosystem Awareness

Neur1GenesisMRSC is the monitoring layer of a larger stack. Changes to data interfaces may affect:
- **Neur1Genesis-1** — Primary data source (EchoNode state, MRSC cycles)
- **NO3SYS** — Fork primitive data shapes
- **NOΣTIC-7** — 7-manifold consciousness state format
- **AeonicNet** — Planetary coherence metrics

When modifying `types.ts`, check cross-repo implications.

## 📬 Contact

- **Project Lead:** Dustin Groves ([@or4cl3-ai-1](https://github.com/or4cl3-ai-1))
- **Email:** dgroves003@gmail.com
- **Issues:** [GitHub Issues](https://github.com/or4cl3-ai-1/Neur1GenesisMRSC/issues)

---

*Or4cl3 AI Solutions — "Code is not just logic; it is a performance."*
