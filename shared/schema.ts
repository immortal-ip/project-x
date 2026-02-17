import { pgTable, text, serial, timestamp, boolean, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

// Export auth models so they are included in the schema
export * from "./models/auth";

// Tournaments table
export const tournaments = pgTable("tournaments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  game: text("game").notNull(), 
  status: text("status", { enum: ["upcoming", "live", "ended"] }).notNull().default("upcoming"),
  startDate: timestamp("start_date").notNull(),
  prizePool: text("prize_pool").notNull(),
  format: text("format").notNull(), 
  registrationLink: text("registration_link"),
  imageUrl: text("image_url"),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Team members table
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  game: text("game").notNull(),
  imageUrl: text("image_url"),
  instagram: text("instagram"),
  discord: text("discord"),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTournamentSchema = createInsertSchema(tournaments).omit({ 
  id: true, 
  createdAt: true 
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
  createdAt: true
});

export type Tournament = typeof tournaments.$inferSelect;
export type InsertTournament = z.infer<typeof insertTournamentSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;

// Response Types
export type TournamentResponse = Tournament;
export type TournamentListResponse = Tournament[];
export type TeamMemberResponse = TeamMember;
export type TeamMemberListResponse = TeamMember[];

// API Types
export const tournamentStatusEnum = z.enum(["upcoming", "live", "ended"]);
