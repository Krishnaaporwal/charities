import { ethers } from 'ethers';

// Helper function to format ETH amount for display
export function formatEthAmount(amount: string): string {
  try {
    return parseFloat(ethers.formatEther(amount)).toFixed(4);
  } catch (error) {
    console.error('Error formatting ETH amount:', error);
    return '0.0000';
  }
}

// Helper function to convert ETH to wei
export function ethToWei(amount: string): string {
  try {
    return ethers.parseEther(amount).toString();
  } catch (error) {
    console.error('Error converting ETH to wei:', error);
    return '0';
  }
}

// Helper function to check if wallet is connected
export function isWalletConnected(): boolean {
  return localStorage.getItem('walletConnected') === 'true';
}

// Platform fee configuration
export const PLATFORM_FEE_ETH = "0.01"; // Platform fee in ETH (0.01 ETH)
export const SEPOLIA_CHAIN_ID = 11155111;

// Helper function to get supported networks
export function getSupportedNetworks() {
  return [
    { id: 11155111, name: 'Sepolia Testnet' }, // Primary network for testing
    { id: 1, name: 'Ethereum Mainnet' },
    { id: 5, name: 'Goerli Testnet' },
    { id: 137, name: 'Polygon Mainnet' },
    { id: 80001, name: 'Mumbai Testnet' },
  ];
}

// Helper function to check if current network is supported
export function isNetworkSupported(chainId: number | null): boolean {
  if (!chainId) return false;
  return getSupportedNetworks().some(network => network.id === chainId);
}

// Helper function to get network name
export function getNetworkName(chainId: number | null): string {
  if (!chainId) return 'Unknown Network';
  const network = getSupportedNetworks().find(network => network.id === chainId);
  return network ? network.name : 'Unknown Network';
}

// Helper function to format wallet address for display
export function formatWalletAddress(address: string | null): string {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

// Mock function for calculating campaign progress (in real app would use on-chain data)
export function calculateCampaignProgress(raised: string, goal: string): number {
  try {
    const raisedValue = parseFloat(raised);
    const goalValue = parseFloat(goal);
    if (goalValue === 0) return 0;
    const progress = (raisedValue / goalValue) * 100;
    return Math.min(progress, 100);
  } catch (error) {
    console.error('Error calculating campaign progress:', error);
    return 0;
  }
}
