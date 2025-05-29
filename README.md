# SkillSwap DAO

**SkillSwap DAO** is a decentralized, cartoon-sketch styled skill marketplace built on Ethereum. It empowers anyone to teach, learn, and earn in a trustless, global, and community-owned platform.

![SkillSwap DAO Banner](public/SkillSwap%20DAO%20Logo%20Design.png)

---

## 🚀 Live Demo

> **[View the Demo](#)**  
> _(Replace with your deployed link if available)_

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [Smart Contract](#smart-contract)
- [Challenges & Learnings](#challenges--learnings)
- [Why SkillSwap DAO for Ethereum Track?](#why-skillswap-dao-for-ethereum-track)
- [License](#license)

---

## Features

- **Decentralized Skill Marketplace:** List, discover, and book skills from anyone, anywhere.
- **Wallet Connect:** Secure login and transactions via MetaMask and other wallets.
- **Trustless Escrow:** Payments are locked in a smart contract and released only after service completion and rating.
- **On-chain Reputation:** User profiles, ratings, and transaction history are persistent and transparent.
- **Cartoon-Sketch UI:** Fun, friendly, and unique user experience.
- **Project & Booking Management:** Users can add, edit, and manage their projects and bookings.
- **Demo-Ready:** All dashboard actions are functional for hackathon judging.

---

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Lucide React
- **Backend:** Supabase (Postgres, Auth, Storage)
- **Web3:** wagmi, RainbowKit, viem, Solidity (SkillExchange.sol)
- **Smart Contract:** Ethereum (Sepolia testnet)
- **Dev Tools:** Hardhat, Ethers.js, React Router

---

## How It Works

1. **Connect Wallet:** Users sign in with MetaMask or any EVM wallet.
2. **Browse & Book Skills:** Discover skills, view details, and book services.
3. **Escrow Payment:** Funds are locked in a smart contract escrow upon booking.
4. **Service Delivery:** After the service, users rate the provider.
5. **Release Payment:** Payment is released trustlessly and instantly to the provider.
6. **Manage Projects:** Users can add, edit, and delete their own projects/bookings.

---

## Getting Started

1. **Clone the repo:**
   ```bash
   git clone https://github.com/yourusername/skillswap-dao.git
   cd skillswap-dao
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local` and fill in your Supabase and Ethereum config.

4. **Run the app:**
   ```bash
   npm run dev
   ```

5. **Deploy contracts (optional):**
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

---

## Smart Contract

- **SkillExchange.sol**  
  Handles skill listing, booking, escrow, and payment release.
- **Deployed on:** Sepolia Testnet  
- **ABI and address:** See `/src/lib/SkillExchangeABI.json` and `/src/lib/SkillExchange.ts`

---

## Challenges & Learnings

- **TypeScript & UI Integration:**  
  Integrating custom UI components with TypeScript required careful type management and sometimes custom type extensions.
- **Web3 UX:**  
  Ensuring seamless wallet connect and contract interaction meant resolving version mismatches and peer dependency issues.
- **State Persistence:**  
  Making sure user data persisted and prefilled correctly for returning users required robust error handling and Supabase schema design.
- **Demo-Ready Experience:**  
  Building a demo that clearly shows the escrow/booking flow required extra UI work, including explainer cards and a mock project management section.

---

## Why SkillSwap DAO for Ethereum Track?

SkillSwap DAO is a real-world demonstration of Ethereum's power to democratize access, trust, and value in the global knowledge economy:

- **Trustless Escrow:** No middlemen—payments are locked and released by smart contract.
- **On-chain Reputation:** Transparent, portable, and censorship-resistant user profiles.
- **Open & Composable:** Built to integrate with other dApps and protocols.
- **User Empowerment:** Anyone can teach, learn, and earn—globally.
- **Hackathon-Ready:** Full-stack, live demo with wallet connect, contract write, and persistent profiles.

**We're not just building a demo—we're building the future of decentralized skill exchange.**

---

## License

MIT

---

**Made with ❤️ for the Ethereum community.**
