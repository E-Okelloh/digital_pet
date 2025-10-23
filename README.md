# 🐱 Digital Pet NFT - Interactive Blockchain Pet Game

<div align="center">

![Digital Pet Banner](https://img.shields.io/badge/Sui-Blockchain-4DA2FF?style=for-the-badge&logo=sui&logoColor=white)
![Move](https://img.shields.io/badge/Move-Smart_Contract-000000?style=for-the-badge)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-Build_Tool-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**A beautiful, interactive NFT pet game built on the Sui blockchain where you can mint, care for, and level up your digital companions!**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [Smart Contract](#-smart-contract-architecture)

</div>

---

## 🎮 Overview

Digital Pet NFT is a fully on-chain pet simulation game that combines blockchain technology with engaging gameplay. Each pet is a unique NFT with real-time stats stored on the Sui blockchain. Players can interact with their pets through feeding, playing, and resting actions - all secured by smart contracts.

### What Makes This Special?

- **Fully On-Chain**: All pet data and logic live on the blockchain - no centralized servers
- **Real NFTs**: Each pet is a genuine NFT you own and can transfer
- **Interactive Gameplay**: Dynamic stats that change based on your actions
- **Beautiful UI**: Stunning gradients, animations, and particle effects
- **Level System**: Gain experience and level up your pets over time
- **Multiple Pets**: Mint and manage a collection of different pet types

---

## ✨ Features

### 🎨 Frontend Features
- **Wallet Integration**: Connect with Sui Wallet, Suiet, Ethos, and other Sui-compatible wallets
- **Real-time Stats**: Live hunger, happiness, and energy tracking
- **Particle Effects**: Beautiful animations when interacting with pets
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Multiple Pet Management**: Switch between all your pets easily
- **Mood System**: Your pet's expression changes based on their stats
- **Experience Bar**: Visual progress tracking for leveling up

### 🔗 Blockchain Features
- **NFT Minting**: Create unique pets with custom names and types (Cat, Dog, Dragon)
- **On-Chain Stats**: All pet attributes stored immutably on Sui
- **Time-Based Decay**: Stats decrease realistically over time
- **Energy System**: Play costs energy, encouraging strategic gameplay
- **Level Progression**: Earn XP by playing to unlock higher levels
- **Event Emissions**: All actions emit blockchain events for transparency

---

## 🛠 Tech Stack

### Smart Contract
- **Sui Move**: High-performance smart contract language
- **Sui Framework**: Built on Sui's object model for efficiency

### Frontend
- **React 19**: Latest React for modern UI development
- **Vite**: Lightning-fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS for beautiful styling
- **@mysten/dapp-kit**: Official Sui wallet integration
- **@mysten/sui**: Sui SDK for blockchain interactions
- **@tanstack/react-query**: Efficient data fetching and caching
- **lucide-react**: Beautiful icon library

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js**: Version 18.x or higher (20.x+ recommended)
- **npm**: Version 9.x or higher
- **Sui CLI**: Latest version installed ([Installation Guide](https://docs.sui.io/guides/developer/getting-started/sui-install))
- **Sui Wallet**: Browser extension installed ([Download](https://chrome.google.com/webstore/detail/sui-wallet))
- **Testnet SUI**: Get free tokens from [Sui Testnet Faucet](https://discord.com/channels/916379725201563759/971488439931392130)

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/digital-pet-nft.git
cd digital-pet-nft
```

### Step 2: Deploy the Smart Contract

```bash
# Navigate to the contract directory
cd digital_pet

# Publish the contract to Sui testnet
sui client publish --gas-budget 100000000

# IMPORTANT: Save the Package ID from the output!
# It will look like: 0x2f09b2c57956fa01891d4d4c2e776a04b2fe4232b71c5ba1be94cedc2246562c
```

**Note**: Copy the `PackageID` from the "Published Objects" section. You'll need it in the next step.

### Step 3: Configure the Frontend

```bash
# Navigate to the UI directory
cd ../pet-ui

# Install dependencies
npm install

# Install additional required packages
npm install @mysten/sui @mysten/dapp-kit @mysten/sui.js @tanstack/react-query lucide-react

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 4: Update Package ID

Open `pet-ui/src/App.jsx` and update the `PACKAGE_ID` constant with your deployed contract's Package ID:

```javascript
const PACKAGE_ID = 'YOUR_PACKAGE_ID_HERE'; // Replace with your Package ID
```

### Step 5: Run the Application

```bash
# Start the development server
npm run dev

# The app will be available at http://localhost:5173
```

---

## 📖 Usage

### 1. Connect Your Wallet

Click the "Connect Wallet" button and select your Sui wallet. Make sure you're on the **Testnet** network.

### 2. Mint Your First Pet

- Click "Mint Pet NFT"
- Enter a name for your pet
- Choose a type: Cat 🐱, Dog 🐶, or Dragon 🐉
- Approve the transaction in your wallet
- Wait for confirmation (~2 seconds)

### 3. Interact With Your Pet

#### 🍖 Feed Pet
- Increases hunger by 30%
- Keeps your pet healthy and happy
- No energy cost

#### ❤️ Play Together
- Increases happiness by 25%
- Gains 15 XP (experience points)
- Costs 20 energy
- Decreases hunger by 10%

#### 💤 Rest & Recharge
- Restores energy to 100%
- Use when energy is low
- Prepares pet for more play sessions

### 4. Level Up Your Pet

- Play with your pet to earn XP
- Each level requires: `Level × 100` XP
- Higher levels = more accomplished pet!
- Track progress with the XP bar

### 5. Manage Multiple Pets

- Mint additional pets anytime
- Switch between pets using the selector
- Each pet maintains independent stats
- All pets are stored as NFTs in your wallet

---

## 🏗 Smart Contract Architecture

### Contract Structure

```
digital_pet/
├── Move.toml           # Package configuration
└── sources/
    └── digital_pet.move # Main contract
```

### Core Structs

#### Pet NFT
```move
public struct Pet has key, store {
    id: UID,
    name: String,
    pet_type: String,
    level: u64,
    experience: u64,
    hunger: u64,      // 0-100
    happiness: u64,   // 0-100
    energy: u64,      // 0-100
    last_fed: u64,
    last_played: u64,
    birth_time: u64,
}
```

### Key Functions

#### `mint_pet`
```move
public entry fun mint_pet(
    name: String,
    pet_type: String,
    clock: &Clock,
    ctx: &mut TxContext
)
```
Creates a new pet NFT and transfers it to the caller.

#### `feed_pet`
```move
public entry fun feed_pet(
    pet: &mut Pet,
    clock: &Clock,
)
```
Increases the pet's hunger stat by 30%.

#### `play_with_pet`
```move
public entry fun play_with_pet(
    pet: &mut Pet,
    clock: &Clock,
)
```
Increases happiness, grants XP, costs energy. May trigger level-up.

#### `rest_pet`
```move
public entry fun rest_pet(
    pet: &mut Pet,
    clock: &Clock,
)
```
Restores energy to maximum (100%).

### Time-Based Mechanics

The contract implements realistic time decay:
- **Hunger**: Decreases 1 point per 5 minutes
- **Happiness**: Decreases 1 point per 10 minutes
- **Energy**: Recovers 1 point per 3 minutes (natural regeneration)

---

## 🎯 Game Mechanics

### Stat System

| Stat | Range | Effect |
|------|-------|--------|
| **Hunger** | 0-100 | <30 = Pet is hungry 😢 |
| **Happiness** | 0-100 | <30 = Pet is lonely 😔 |
| **Energy** | 0-100 | <20 = Can't play, needs rest 😴 |

### Experience & Leveling

- **XP per Play**: 15 XP
- **XP to Level**: Current Level × 100
- **Level Benefits**: Prestige and bragging rights!

### Mood States

Your pet's mood is determined by their stats:

- 😊 **Happy & Healthy**: Happiness > 70 & Hunger > 50
- 😢 **Hungry**: Hunger < 30
- 😔 **Lonely**: Happiness < 30
- 😴 **Tired**: Energy < 20
- 😌 **Doing Okay**: Default state

---

## 🎨 UI Components

### Color System

```javascript
// Stat bars change color based on value
- Green (70-100): Healthy range
- Yellow (40-70): Caution range
- Red (0-40): Critical range
```

### Animations

- **Particle Effects**: Burst when performing actions
- **Smooth Transitions**: All stat changes animated
- **Hover Effects**: Interactive button scaling
- **Star Background**: Animated twinkling stars
- **Loading States**: Clear feedback during transactions

---

## 🔧 Configuration

### Network Configuration

Edit `pet-ui/src/main.jsx` to change networks:

```javascript
const networks = {
  devnet: { url: getFullnodeUrl('devnet') },
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
};

// Change defaultNetwork here
<SuiClientProvider networks={networks} defaultNetwork="testnet">
```

### Styling Customization

All styles use Tailwind CSS. Customize in:
- `pet-ui/tailwind.config.js` - Theme configuration
- `pet-ui/src/index.css` - Global styles
- Component classes - Inline Tailwind utilities

---

## 🐛 Troubleshooting

### Common Issues

#### Black Screen
**Problem**: Page loads but shows nothing  
**Solution**: Check browser console for errors. Usually a missing import or dependency.

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Transaction Fails
**Problem**: Wallet transaction rejected  
**Solution**: 
1. Ensure you have testnet SUI tokens
2. Check you're on the correct network (testnet)
3. Verify the Package ID is correct in `App.jsx`

#### Pets Not Loading
**Problem**: Wallet connected but no pets shown  
**Solution**:
1. Check the Package ID matches your deployment
2. Verify you're on the same network as your contract
3. Try refreshing the page

#### Module Import Errors
**Problem**: `Transaction not found` or similar  
**Solution**:

```bash
# Install the correct Sui package
npm install @mysten/sui
```

---

## 📁 Project Structure

```
digital-pet-nft/
├── digital_pet/              # Smart contract
│   ├── Move.toml            # Move package config
│   └── sources/
│       └── digital_pet.move # Contract code
│
└── pet-ui/                   # React frontend
    ├── public/              # Static assets
    ├── src/
    │   ├── App.jsx         # Main app component
    │   ├── main.jsx        # Entry point
    │   └── index.css       # Global styles
    ├── index.html          # HTML template
    ├── package.json        # Dependencies
    ├── vite.config.js      # Vite config
    └── tailwind.config.js  # Tailwind config
```

---

## 🚦 Development Workflow

### Making Changes to the Contract

```bash
cd digital_pet

# Make your changes to sources/digital_pet.move

# Republish (creates a new Package ID)
sui client publish --gas-budget 100000000

# Update the Package ID in pet-ui/src/App.jsx
```

### Hot Reload Frontend

The Vite dev server supports hot module replacement (HMR):

```bash
cd pet-ui
npm run dev

# Edit files in src/ - changes appear instantly!
```

---

## 🔐 Security Considerations

- **No Private Keys in Code**: Never commit wallet private keys
- **Testnet First**: Always test on testnet before mainnet
- **Gas Budgets**: Set appropriate gas budgets for transactions
- **Input Validation**: Contract validates all inputs
- **Time Manipulation**: Uses Sui Clock object for tamper-proof timestamps

---

## 🎓 Learning Resources

### Sui Development
- [Sui Documentation](https://docs.sui.io/)
- [Move Book](https://move-language.github.io/move/)
- [Sui Examples](https://github.com/MystenLabs/sui/tree/main/examples)

### React & Web3
- [React Documentation](https://react.dev/)
- [Sui dApp Kit Guide](https://sdk.mystenlabs.com/dapp-kit)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Ideas for Contributions

- Add new pet types (bird, fish, etc.)
- Implement pet breeding mechanics
- Create a leaderboard system
- Add pet accessories/customization
- Implement pet battles/competitions
- Add more mini-games

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Sui Foundation**: For the amazing blockchain platform
- **Mysten Labs**: For the excellent developer tools
- **Tailwind CSS**: For the beautiful utility-first CSS
- **Lucide**: For the gorgeous icon set

---

## 📞 Support

Having issues? Here's how to get help:

1. **Check Documentation**: Read this README thoroughly
2. **GitHub Issues**: [Open an issue](https://github.com/yourusername/digital-pet-nft/issues)
3. **Sui Discord**: Join the [Sui Discord](https://discord.gg/sui) community
4. **Stack Overflow**: Tag questions with `sui` and `move-language`

---

## 🗺 Roadmap

### Phase 1: Core Features ✅
- [x] Basic pet minting
- [x] Feeding, playing, resting
- [x] Level system
- [x] Beautiful UI

### Phase 2: Enhanced Gameplay 🚧
- [ ] Pet evolution (visual changes at certain levels)
- [ ] Achievement system
- [ ] Daily rewards
- [ ] Pet trading marketplace

### Phase 3: Social Features 📅
- [ ] Pet battles (PvP)
- [ ] Global leaderboards
- [ ] Friend system
- [ ] Pet breeding

### Phase 4: Economy 📅
- [ ] In-game currency
- [ ] Pet accessories shop
- [ ] Staking rewards
- [ ] Tournament prizes

---

## 📊 Statistics

```
Lines of Code: ~800
Smart Contract: ~170 lines
Frontend: ~630 lines
Gas Cost (Mint): ~0.018 SUI
Transaction Speed: ~2 seconds
```

---

<div align="center">

**Built with ❤️ by the Digital Pet Team**

[⬆ Back to Top](#-digital-pet-nft---interactive-blockchain-pet-game)

</div>
