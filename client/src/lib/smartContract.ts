import { ethers } from 'ethers';

// Mock ABI for a crowdfunding contract
// In a real application, this would be replaced with the actual ABI
const CROWDFUNDING_ABI = [
  "function createCampaign(string title, string description, uint256 goal, uint256 deadline) public returns (uint256)",
  "function donateToCampaign(uint256 campaignId) public payable",
  "function getCampaign(uint256 campaignId) public view returns (address creator, string title, string description, uint256 goal, uint256 raised, uint256 deadline, bool completed)",
  "function withdrawFunds(uint256 campaignId) public",
  "function getCampaignCount() public view returns (uint256)",
  "event CampaignCreated(uint256 indexed campaignId, address indexed creator)",
  "event DonationReceived(uint256 indexed campaignId, address indexed donor, uint256 amount)",
  "event CampaignCompleted(uint256 indexed campaignId)",
];

// Sample contract address (this would be an actual deployed contract in production)
const CROWDFUNDING_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";

// Class to interact with the crowdfunding smart contract
export class CrowdfundingContract {
  private contract: ethers.Contract | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  
  constructor(signer: ethers.JsonRpcSigner | null) {
    this.signer = signer;
    if (signer) {
      this.contract = new ethers.Contract(
        CROWDFUNDING_CONTRACT_ADDRESS,
        CROWDFUNDING_ABI,
        signer
      );
    }
  }

  // Check if contract is initialized
  private ensureContract(): boolean {
    if (!this.contract || !this.signer) {
      console.error("Contract not initialized. Connect wallet first.");
      return false;
    }
    return true;
  }

  // Create a new campaign
  async createCampaign(
    title: string,
    description: string,
    goalAmount: string,
    deadline: Date
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      if (!this.ensureContract()) {
        return { success: false, error: "Wallet not connected" };
      }

      // Convert goal to wei
      const goalInWei = ethers.parseEther(goalAmount);
      
      // Convert deadline to Unix timestamp
      const deadlineTimestamp = Math.floor(deadline.getTime() / 1000);
      
      // Call the smart contract
      const tx = await this.contract!.createCampaign(
        title,
        description,
        goalInWei,
        deadlineTimestamp
      );
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      return {
        success: true,
        txHash: receipt.hash,
      };
    } catch (error: any) {
      console.error("Error creating campaign:", error);
      return {
        success: false,
        error: error.message || "Failed to create campaign",
      };
    }
  }

  // Donate to a campaign
  async donateToCampaign(
    campaignId: number,
    amount: string
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      if (!this.ensureContract()) {
        return { success: false, error: "Wallet not connected" };
      }

      // Convert amount to wei
      const amountInWei = ethers.parseEther(amount);
      
      // Call the smart contract with value
      const tx = await this.contract!.donateToCampaign(campaignId, {
        value: amountInWei,
      });
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      return {
        success: true,
        txHash: receipt.hash,
      };
    } catch (error: any) {
      console.error("Error donating to campaign:", error);
      return {
        success: false,
        error: error.message || "Failed to donate to campaign",
      };
    }
  }

  // Withdraw funds from a campaign
  async withdrawFunds(
    campaignId: number
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      if (!this.ensureContract()) {
        return { success: false, error: "Wallet not connected" };
      }
      
      // Call the smart contract
      const tx = await this.contract!.withdrawFunds(campaignId);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      return {
        success: true,
        txHash: receipt.hash,
      };
    } catch (error: any) {
      console.error("Error withdrawing funds:", error);
      return {
        success: false,
        error: error.message || "Failed to withdraw funds",
      };
    }
  }

  // Get campaign details
  async getCampaign(
    campaignId: number
  ): Promise<{ 
    success: boolean; 
    data?: {
      creator: string;
      title: string;
      description: string;
      goal: string;
      raised: string;
      deadline: Date;
      completed: boolean;
    };
    error?: string 
  }> {
    try {
      if (!this.ensureContract()) {
        return { success: false, error: "Wallet not connected" };
      }
      
      // Call the smart contract
      const result = await this.contract!.getCampaign(campaignId);
      
      // Parse the result
      return {
        success: true,
        data: {
          creator: result[0],
          title: result[1],
          description: result[2],
          goal: ethers.formatEther(result[3]),
          raised: ethers.formatEther(result[4]),
          deadline: new Date(result[5].toNumber() * 1000),
          completed: result[6],
        },
      };
    } catch (error: any) {
      console.error("Error getting campaign:", error);
      return {
        success: false,
        error: error.message || "Failed to get campaign details",
      };
    }
  }
}
