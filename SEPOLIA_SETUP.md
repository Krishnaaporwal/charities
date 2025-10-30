# Sepolia Testnet Setup Guide

## What is Sepolia?
Sepolia is an Ethereum testnet used for testing smart contracts and dApps before deploying to mainnet. All transactions use test ETH which has no real-world value.

## Getting Sepolia Test ETH

### 1. Add Sepolia to MetaMask
The platform will automatically prompt you to switch to Sepolia when you connect your wallet. If you need to add it manually:

- Network Name: `Sepolia Testnet`
- RPC URL: `https://rpc.sepolia.org`
- Chain ID: `11155111`
- Currency Symbol: `SEP ETH`
- Block Explorer: `https://sepolia.etherscan.io`

### 2. Get Free Test ETH from Faucets

#### Recommended Faucets:
1. **Alchemy Sepolia Faucet** (Recommended)
   - URL: https://sepoliafaucet.com
   - Requires: Alchemy account (free)
   - Amount: 0.5 SEP ETH per day

2. **Infura Sepolia Faucet**
   - URL: https://www.infura.io/faucet/sepolia
   - Requires: Infura account (free)
   - Amount: 0.5 SEP ETH per day

3. **QuickNode Sepolia Faucet**
   - URL: https://faucet.quicknode.com/ethereum/sepolia
   - Requires: Twitter account
   - Amount: 0.1 SEP ETH per request

4. **Sepolia PoW Faucet**
   - URL: https://sepolia-faucet.pk910.de
   - Requires: Browser mining (no account needed)
   - Amount: Variable based on mining time

### 3. How to Use the Faucets

1. Copy your MetaMask wallet address (click on account name to copy)
2. Visit one of the faucet links above
3. Paste your wallet address
4. Complete any verification (captcha, login, etc.)
5. Wait 30-60 seconds for the test ETH to arrive
6. Check your MetaMask - you should see SEP ETH balance

## Platform Fee

### Current Fee: 0.01 SEP ETH
- **Purpose**: One-time fee to create a campaign
- **Network**: Sepolia Testnet only
- **Value**: Test tokens (no real cost)

### Why is there a platform fee?
The platform fee demonstrates real-world functionality where:
- Platform maintenance is funded
- Spam campaigns are discouraged
- Smart contract deployment costs are covered

On Sepolia testnet, this fee is **free** (test tokens have no value) but shows how the system will work on mainnet.

## Troubleshooting

### "Insufficient funds" error
- You need at least 0.01 SEP ETH to create a campaign
- Get more test ETH from faucets listed above
- Some faucets have daily limits, try multiple faucets if needed

### "Wrong network" error
- Make sure MetaMask is connected to Sepolia testnet
- The platform will auto-prompt you to switch networks
- Check the network dropdown in MetaMask shows "Sepolia"

### Faucet not working
- Try a different faucet from the list
- Some faucets require social media verification
- Wait 24 hours and try again (daily limits)
- Use the PoW faucet if others are unavailable

## Contract Deployment (For Developers)

### Deploy to Sepolia
1. Update `hardhat.config.cjs` with your Alchemy API key
2. Add your private key (testnet wallet only!)
3. Run: `npx hardhat run scripts/deploy.js --network sepolia`
4. Update contract address in `client/src/lib/smartContract.ts`

### Get Alchemy API Key
1. Sign up at https://www.alchemy.com
2. Create a new app
3. Select "Ethereum" and "Sepolia"
4. Copy the API key

## Resources

- **Sepolia Explorer**: https://sepolia.etherscan.io
- **Sepolia Status**: https://sepolia.dev
- **MetaMask Guide**: https://metamask.io/faqs
- **Ethereum Testnet Guide**: https://ethereum.org/en/developers/docs/networks/#testnets

## Security Notes

⚠️ **Important**: 
- Never use your mainnet private key on testnets
- Create a separate wallet for testnet development
- Testnet tokens have no value - don't buy them!
- Never share your private keys or seed phrase

## Need Help?

- Check MetaMask console for error details
- Verify you're on Sepolia network
- Ensure sufficient SEP ETH balance
- Contact support if issues persist
