import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address").unique(),
  email: text("email"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  walletAddress: true,
  email: true,
});

// Campaign schema
export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  category: text("category").notNull(),
  goalAmount: text("goal_amount").notNull(), // Stored as string to handle large numbers
  raisedAmount: text("raised_amount").default("0"),
  creatorId: integer("creator_id").notNull(),
  walletAddress: text("wallet_address").notNull(),
  deadline: timestamp("deadline").notNull(),
  isActive: boolean("is_active").default(true),
  creatorType: text("creator_type").notNull().default("individual"), // 'individual' or 'ngo'
  ngoName: text("ngo_name"),
  ngoRegistrationNumber: text("ngo_registration_number"),
  ngoDescription: text("ngo_description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCampaignSchema = createInsertSchema(campaigns).pick({
  title: true,
  description: true, 
  imageUrl: true,
  category: true,
  goalAmount: true,
  creatorId: true,
  walletAddress: true,
  deadline: true,
  creatorType: true,
  ngoName: true,
  ngoRegistrationNumber: true,
  ngoDescription: true,
}).extend({
  deadline: z.union([z.string(), z.date()]).transform((val) => {
    if (typeof val === 'string') {
      return new Date(val);
    }
    return val;
  })
});

// Donation schema
export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull(),
  donorAddress: text("donor_address").notNull(),
  amount: text("amount").notNull(), // Stored as string to handle large numbers
  transactionHash: text("transaction_hash").notNull().unique(),
  donorId: integer("donor_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDonationSchema = createInsertSchema(donations).pick({
  campaignId: true,
  donorAddress: true,
  amount: true,
  transactionHash: true,
  donorId: true,
});

// Waitlist schema
export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWaitlistSchema = createInsertSchema(waitlist).pick({
  email: true,
});

// NGO Reports schema
export const ngoReports = pgTable("ngo_reports", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  reportData: jsonb("report_data"), // Store structured data like beneficiaries, funds spent, etc.
  images: jsonb("images"), // Array of image URLs
  documents: jsonb("documents"), // Array of document URLs
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertNgoReportSchema = createInsertSchema(ngoReports).pick({
  campaignId: true,
  title: true,
  description: true,
  reportData: true,
  images: true,
  documents: true,
});

// NGO Milestones schema
export const ngoMilestones = pgTable("ngo_milestones", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  targetDate: timestamp("target_date"),
  completedDate: timestamp("completed_date"),
  status: text("status").notNull().default("pending"), // 'pending', 'in-progress', 'completed'
  impactMetrics: jsonb("impact_metrics"), // Store metrics like people helped, items distributed, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNgoMilestoneSchema = createInsertSchema(ngoMilestones).pick({
  campaignId: true,
  title: true,
  description: true,
  targetDate: true,
  completedDate: true,
  status: true,
  impactMetrics: true,
});

// Define types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;

export type Donation = typeof donations.$inferSelect;
export type InsertDonation = z.infer<typeof insertDonationSchema>;

export type Waitlist = typeof waitlist.$inferSelect;
export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;

export type NgoReport = typeof ngoReports.$inferSelect;
export type InsertNgoReport = z.infer<typeof insertNgoReportSchema>;

export type NgoMilestone = typeof ngoMilestones.$inferSelect;
export type InsertNgoMilestone = z.infer<typeof insertNgoMilestoneSchema>;
