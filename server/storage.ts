import { 
  users, User, InsertUser, 
  campaigns, Campaign, InsertCampaign,
  donations, Donation, InsertDonation,
  waitlist, Waitlist, InsertWaitlist
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Campaign methods
  getCampaign(id: number): Promise<Campaign | undefined>;
  getAllCampaigns(): Promise<Campaign[]>;
  getCampaignsByCategory(category: string): Promise<Campaign[]>;
  getCampaignsByCreator(creatorId: number): Promise<Campaign[]>; 
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: number, updates: Partial<Campaign>): Promise<Campaign | undefined>;
  updateCampaignRaisedAmount(id: number, amount: string): Promise<Campaign | undefined>;
  
  // Donation methods
  getDonation(id: number): Promise<Donation | undefined>;
  getDonationsByUser(userId: number): Promise<Donation[]>;
  getDonationsByCampaign(campaignId: number): Promise<Donation[]>;
  createDonation(donation: InsertDonation): Promise<Donation>;
  
  // Waitlist methods
  addToWaitlist(email: InsertWaitlist): Promise<Waitlist>;
  isEmailInWaitlist(email: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private campaigns: Map<number, Campaign>;
  private donations: Map<number, Donation>;
  private waitlistEmails: Map<number, Waitlist>;
  private userId: number;
  private campaignId: number;
  private donationId: number;
  private waitlistId: number;

  constructor() {
    this.users = new Map();
    this.campaigns = new Map();
    this.donations = new Map();
    this.waitlistEmails = new Map();
    this.userId = 1;
    this.campaignId = 1;
    this.donationId = 1;
    this.waitlistId = 1;
    
    // Add admin user
    this.users.set(1, {
      id: 1,
      username: 'admin',
      password: 'admin', // In production, this would be hashed
      walletAddress: '0x1234567890abcdef',
      email: 'admin@cryptofund.xyz',
      isAdmin: true,
      createdAt: new Date()
    });
    
    // Add sample campaigns for development
    this.addSampleCampaigns();
  }

  private addSampleCampaigns() {
    const sampleCampaigns: InsertCampaign[] = [
      {
        title: "Decentralized Solar Grid",
        description: "Building solar microgrids with blockchain-based energy trading for rural communities.",
        imageUrl: "https://images.unsplash.com/photo-1511376979163-f804dff7ad7b",
        category: "ENERGY",
        goalAmount: "20",
        creatorId: 1,
        walletAddress: "0x1234567890abcdef",
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        title: "Web3 Educational Platform",
        description: "Creating accessible blockchain education for underserved communities globally.",
        imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0",
        category: "EDUCATION",
        goalAmount: "5",
        creatorId: 1,
        walletAddress: "0x1234567890abcdef",
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
      },
      {
        title: "DeFi for Healthcare",
        description: "Revolutionizing healthcare payments with DeFi protocols for transparent medical funding.",
        imageUrl: "https://images.unsplash.com/photo-1559526324-593bc073d938",
        category: "HEALTHCARE",
        goalAmount: "15",
        creatorId: 1,
        walletAddress: "0x1234567890abcdef",
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
      }
    ];

    sampleCampaigns.forEach(campaign => {
      const id = this.campaignId++;
      this.campaigns.set(id, {
        ...campaign,
        id, 
        raisedAmount: id === 1 ? "12.5" : id === 2 ? "3.8" : "8.2",
        isActive: true,
        createdAt: new Date()
      });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.walletAddress === walletAddress);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { 
      ...insertUser, 
      id, 
      isAdmin: false, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Campaign methods
  async getCampaign(id: number): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }

  async getAllCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values());
  }

  async getCampaignsByCategory(category: string): Promise<Campaign[]> {
    return Array.from(this.campaigns.values())
      .filter(campaign => campaign.category.toLowerCase() === category.toLowerCase());
  }

  async getCampaignsByCreator(creatorId: number): Promise<Campaign[]> {
    return Array.from(this.campaigns.values())
      .filter(campaign => campaign.creatorId === creatorId);
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const id = this.campaignId++;
    const newCampaign: Campaign = {
      ...campaign,
      id,
      raisedAmount: "0",
      isActive: true,
      createdAt: new Date()
    };
    this.campaigns.set(id, newCampaign);
    return newCampaign;
  }

  async updateCampaign(id: number, updates: Partial<Campaign>): Promise<Campaign | undefined> {
    const campaign = this.campaigns.get(id);
    if (!campaign) return undefined;
    
    const updatedCampaign = { ...campaign, ...updates };
    this.campaigns.set(id, updatedCampaign);
    return updatedCampaign;
  }

  async updateCampaignRaisedAmount(id: number, amount: string): Promise<Campaign | undefined> {
    const campaign = this.campaigns.get(id);
    if (!campaign) return undefined;
    
    const currentAmount = parseFloat(campaign.raisedAmount);
    const newAmount = currentAmount + parseFloat(amount);
    
    const updatedCampaign = { 
      ...campaign, 
      raisedAmount: newAmount.toString() 
    };
    this.campaigns.set(id, updatedCampaign);
    return updatedCampaign;
  }

  // Donation methods
  async getDonation(id: number): Promise<Donation | undefined> {
    return this.donations.get(id);
  }

  async getDonationsByUser(userId: number): Promise<Donation[]> {
    return Array.from(this.donations.values())
      .filter(donation => donation.donorId === userId);
  }

  async getDonationsByCampaign(campaignId: number): Promise<Donation[]> {
    return Array.from(this.donations.values())
      .filter(donation => donation.campaignId === campaignId);
  }

  async createDonation(donation: InsertDonation): Promise<Donation> {
    const id = this.donationId++;
    const newDonation: Donation = {
      ...donation,
      id,
      createdAt: new Date()
    };
    this.donations.set(id, newDonation);
    
    // Update campaign raised amount
    await this.updateCampaignRaisedAmount(donation.campaignId, donation.amount);
    
    return newDonation;
  }

  // Waitlist methods
  async addToWaitlist(data: InsertWaitlist): Promise<Waitlist> {
    const id = this.waitlistId++;
    const newEntry: Waitlist = {
      ...data,
      id,
      createdAt: new Date()
    };
    this.waitlistEmails.set(id, newEntry);
    return newEntry;
  }

  async isEmailInWaitlist(email: string): Promise<boolean> {
    return Array.from(this.waitlistEmails.values())
      .some(entry => entry.email === email);
  }
}

export const storage = new MemStorage();
