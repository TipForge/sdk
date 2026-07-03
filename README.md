# TipForge SDK

Client abstraction layer for TipForge — provides a clean, type-safe API for frontend and external integrations.

## Purpose

The SDK translates backend contracts into a developer-friendly interface:

- Wraps backend REST API
- Provides utility functions for common operations
- Optional React hooks for easier integration
- Framework-agnostic core (works with vanilla JS, Vue, etc.)

**Design principle:** SDK = translation layer. All types and contracts flow from the backend.

## Installation

```bash
npm install tipforge-sdk
```

## Quick Start

### Basic usage (vanilla JavaScript)

```javascript
import { TipForgeClient } from 'tipforge-sdk';

const client = new TipForgeClient('https://api.tipforge.com');

// Sign up
const auth = await client.signup({
  email: 'fan@example.com',
  password: 'secure-password',
});

client.setToken(auth.token);

// Send a tip
const tip = await client.createTip({
  creatorId: 'creator-123',
  amount: 5,
  message: 'Great content!',
});

console.log('Tip sent:', tip);
```

### React usage

```javascript
import { TipForgeProvider, useTipForge, useTransaction } from 'tipforge-sdk/react';

function App() {
  return (
    <TipForgeProvider baseUrl="https://api.tipforge.com">
      <YourApp />
    </TipForgeProvider>
  );
}

function SendTipComponent() {
  const { client, setToken } = useTipForge();
  const { createTip, loading, error } = useTransaction();

  const handleSendTip = async () => {
    try {
      const result = await createTip({
        creatorId: 'creator-123',
        amount: 5,
      });
      console.log('Tip sent:', result);
    } catch (err) {
      console.error('Failed to send tip:', err);
    }
  };

  return (
    <button onClick={handleSendTip} disabled={loading}>
      {loading ? 'Sending...' : 'Send Tip'}
    </button>
  );
}
```

## API

### TipForgeClient

Main class for API interactions.

#### Constructor

```typescript
new TipForgeClient(baseUrl: string, token?: string)
```

#### Authentication

```typescript
// Sign up
client.signup({ email, password, name? });

// Login
client.login({ email, password });

// Get current user
client.getCurrentUser();

// Manage token
client.setToken(token);
client.clearToken();
```

#### Creators

```typescript
// Register as creator
client.registerAsCreator({ username, description?, isPublic? });

// Get creator profile
client.getCreatorProfile(creatorId);

// Update creator profile
client.updateCreatorProfile(creatorId, { username?, description?, isPublic? });

// Get creator earnings
client.getCreatorEarnings(creatorId);
```

#### Wallets

```typescript
// Connect wallet
client.connectWallet({ publicKey, name? });

// Get wallets
client.getWallets();

// Set default wallet
client.setDefaultWallet(walletId);
```

#### Payments

```typescript
// Create tip
client.createTip({ creatorId, amount, message? });

// Get transaction history
client.getTransactionHistory(page?, pageSize?);

// Get single transaction
client.getTransaction(transactionId);
```

#### Social Profiles

```typescript
// Add social profile
client.addSocialProfile({ platform, username, profileUrl? });

// Remove social profile
client.removeSocialProfile(profileId);
```

### React Hooks

Hooks for React applications. Must be used within `TipForgeProvider`.

#### useTipForge()

Access client and auth state:

```typescript
const { client, token, setToken } = useTipForge();
```

#### useCreator(creatorId)

Fetch creator profile:

```typescript
const { creator, loading, error } = useCreator('creator-123');
```

#### useTransaction()

Handle tip creation:

```typescript
const { transaction, loading, error, createTip } = useTransaction();
await createTip({ creatorId: '123', amount: 5 });
```

#### useWallet()

Manage wallets:

```typescript
const { wallets, loading, error, setDefault } = useWallet();
await setDefault(walletId);
```

### Utilities

Helper functions for common operations.

#### WalletUtils

```typescript
import { WalletUtils } from 'tipforge-sdk';

WalletUtils.isValidPublicKey(publicKey);
WalletUtils.isValidSecretKey(secretKey);
WalletUtils.getPublicKeyFromSecret(secretKey);
WalletUtils.generateKeypair(); // For testing only
```

#### TransactionUtils

```typescript
import { TransactionUtils } from 'tipforge-sdk';

TransactionUtils.isConfirmed(transaction);
TransactionUtils.isPending(transaction);
TransactionUtils.hasFailed(transaction);
TransactionUtils.formatAmount(5); // "5.00 USDC"
TransactionUtils.formatDate(dateString);
TransactionUtils.getStatusLabel(status);
TransactionUtils.getStellarExplorerUrl(txHash);
```

#### ValidationUtils

```typescript
import { ValidationUtils } from 'tipforge-sdk';

ValidationUtils.validateEmail(email);
ValidationUtils.validatePublicKey(publicKey);
ValidationUtils.validateSignup(data);
ValidationUtils.validateCreateTip(data);
```

## Types

All types exported from the SDK match backend contracts:

```typescript
import type {
  CreatorProfileResponse,
  TransactionResponse,
  WalletResponse,
  UserResponse,
} from 'tipforge-sdk';
```

## Project Structure

```
src/
├── index.ts              # Main exports
├── types.ts              # Type definitions (from backend)
├── client.ts             # TipForgeClient class
├── utils/
│   ├── wallet.ts         # Wallet utilities
│   ├── transaction.ts    # Transaction utilities
│   └── validation.ts     # Validation schemas
└── react/
    ├── index.ts          # React exports
    ├── hooks/            # React hooks
    └── context/          # Context provider
```

## Development

```bash
npm run dev      # Watch and compile
npm run build    # Build once
npm run lint     # Lint
npm run format   # Format code
npm run test     # Run tests
```

## Code Standards

- **TypeScript:** Strict mode, no `any`
- **Formatting:** Prettier
- **Linting:** ESLint
- **Validation:** Zod schemas for runtime safety

## Notes

- SDK types **must** stay in sync with backend contracts
- React hooks are optional — core client works anywhere
- Always validate input using `ValidationUtils` before sending to backend
- Keep payment logic in backend, not SDK
