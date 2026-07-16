# Contributing to AgroMarket 🌾

Thank you for your interest in contributing to AgroMarket! As an open-source decentralized agricultural marketplace, our goal is to build secure, transparent, and direct trade channels for farmers and buyers globally. 

By contributing, you help make agricultural commerce more accessible, secure, and intermediate-free.

---

## 📖 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [How to Pick Issues](#-how-to-pick-issues)
- [Development Setup](#-development-setup)
- [Folder Structure](#-folder-structure)
- [Branch Naming Conventions](#-branch-naming-conventions)
- [Commit Message Conventions](#-commit-message-conventions)
- [Coding Standards](#-coding-standards)
- [Testing Requirements](#-testing-requirements)
- [Documentation Requirements](#-documentation-requirements)
- [Pull Request Process](#-pull-request-process)
- [Code Review Process](#-code-review-process)
- [Community & Expectations](#-community--expectations)

---

## 🤝 Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free community for everyone. All contributors are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please report any unacceptable behavior to the maintainers at `report@agromarket.org`.

---

## 📌 How to Pick Issues

If you are a first-time contributor, look for issues with the following labels:
- `good first issue` — Relatively simple changes suitable for beginners.
- `help wanted` — Open tasks looking for contributors of any experience level.

Before starting work:
1. Please comment on the issue asking to be assigned.
2. Wait for a maintainer to assign you to prevent duplicate efforts.
3. If you want to propose a new feature, open a **Feature Proposal** issue first to discuss the design.

---

## 💻 Development Setup

Follow these steps to run AgroMarket locally:

1. **Fork the Repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/agromarket.git
   cd agromarket
   ```
3. **Configure Upstream Remote**:
   ```bash
   git remote add upstream https://github.com/agromarket/agromarket.git
   ```
4. **Install Dependencies**:
   ```bash
   npm install
   ```
5. **Setup Environment Variables**:
   Copy `.env.example` to `.env.local` and fill in your Supabase project URL, Anon Key, and Stellar merchant address.
6. **Start Development Server**:
   ```bash
   npm run dev
   ```

---

## 📂 Folder Structure

AgroMarket uses a **Feature-based architecture** combined with Next.js App Router:

```
src/
├── app/                  # Next.js App Router routing layouts & pages
├── components/           # Generic global UI elements (button, dialog, input)
├── features/             # Feature-based modular directory
│   ├── <feature_name>/
│   │   ├── components/   # Feature-specific components
│   │   ├── hooks/        # React Query and custom hooks
│   │   ├── services/     # Supabase DB and external API connections
│   │   └── types/        # TypeScript interfaces
├── lib/                  # Globals, supabaseClient initializations
└── proxy.ts              # Proxy setups
```

*Rule of thumb:* If a component or helper belongs solely to one feature (e.g., the Cart is checkout-only), keep it within `src/features/checkout/`. Move it to `src/components/` only when shared across 3+ unrelated features.

---

## 🌿 Branch Naming Conventions

Create a descriptive branch for your work:

- Features: `feat/short-description` (e.g. `feat/stellar-asset-anchor`)
- Bug Fixes: `fix/issue-id-short-description` (e.g. `fix/cart-quantity-bounds`)
- Documentation: `docs/short-description` (e.g. `docs/contributing-guide`)
- Refactoring: `refactor/short-description` (e.g. `refactor/session-provider`)

---

## 💬 Commit Message Conventions

We enforce **Conventional Commits** to keep our git log readable and automate changelogs. Format:

```
<type>(<scope>): <description>

[optional body]
```

### Types
- `feat`: A new feature (e.g. `feat(checkout): support multiple payment addresses`)
- `fix`: A bug fix (e.g. `fix(reviews): prevent double rating trigger`)
- `docs`: Documentation changes (e.g. `docs(readme): add deploy steps`)
- `style`: Formatting, missing semi-colons, no production changes
- `refactor`: Code changes that neither fix a bug nor add a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Build steps, package updates, dev tools config

---

## 📐 Coding Standards

- **TypeScript:** Strict mode is enabled. Avoid using `any` type definitions.
- **Components:** Functional components using React Hooks. Use `use client` directives carefully only when DOM interaction or state is required.
- **Styling:** CSS variables for system tokens combined with utility Tailwind classes. Do not hardcode arbitrary values where theme variables are available.
- **Forms:** Declare schemas using Zod. Manage form states using React Hook Form resolver hooks.
- **State Management:** Leverage TanStack Query for server state cache syncs. Keep client-side state localized.

---

## 🧪 Testing Requirements

Before proposing changes, ensure you write automated tests matching these metrics:
- **Unit Tests:** Ensure logic inside services (`src/features/*/services/`) is fully covered.
- **Integration Tests:** Verify complex checkout state actions and database queries.
- **Verification Commands:** Run local checks to verify syntax:
  ```bash
  npx tsc --noEmit
  npm run lint
  ```

---

## 📝 Documentation Requirements

- **In-Code Comments:** Document complex operations, math formulas (e.g. Stellar base fee multiplier), and database policies.
- **Component Docs:** Document React components using standard JSDoc block comments.
- **Walkthroughs:** If your changes introduce a new feature or database migration, update `walkthrough.md` to explain the changes.

---

## 🔀 Pull Request Process

1. Pull recent updates from the upstream branch:
   ```bash
   git pull upstream master
   ```
2. Run typescript compilation and lint checks locally.
3. Push your topic branch to your fork on GitHub.
4. Open a Pull Request pointing to `agromarket/master`.
5. Describe your changes clearly in the PR template, referencing any closed issue IDs (e.g., `Closes #124`).
6. Acknowledge and resolve any CI checks errors.

---

## 🔍 Code Review Process

- Every PR requires **at least one approval** from a core maintainer before merging.
- Reviewers will look for code readability, performance optimizations (such as DB index usage), type-safety, and validation rules.
- Be receptive to feedback. Discussions should focus strictly on technical improvement and community benefit.

---

## 🌟 Community & Expectations

- Be respectful and supportive. Help others in discussions, issues, and PR comments.
- Keep issues and pull requests focused. Large refactors should be split into smaller, logical chunks.
- If you notice spam, toxic comments, or duplicate issues, tag a maintainer.

Thank you for helping make AgroMarket the best agricultural trading platform! 🌾
