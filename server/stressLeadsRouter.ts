import { z } from "zod";
import { publicProcedure, adminProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { stressLeads, InsertStressLead } from "../drizzle/schema";
import { sendStressReport } from "./emailService";
import { desc, eq, sql } from "drizzle-orm";

export const stressLeadsRouter = router({
  /**
   * Public endpoint: Submit stress assessment results and send email report.
   * Called from the frontend after the user completes the assessment and enters their name + email.
   */
  submit: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(256),
        email: z.string().email().max(320),
        score: z.number().int().min(10).max(100),
        stressLevel: z.number().int().min(0).max(9),
        tierTitle: z.string(),
        tierId: z.number().int().min(1).max(4),
        tierSummary: z.string(),
        primaryGuru: z.string(),
        secondaryGuru: z.string().optional(),
        domainAverages: z.record(z.string(), z.number()),
        answers: z.record(z.string(), z.any()).optional(),
        bodyMapAreas: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Save lead to database
      const leadData: InsertStressLead = {
        name: input.name,
        email: input.email,
        score: input.score,
        stressLevel: input.stressLevel,
        tierTitle: input.tierTitle,
        tierId: input.tierId,
        primaryGuru: input.primaryGuru,
        secondaryGuru: input.secondaryGuru ?? null,
        domainAverages: input.domainAverages,
        answers: input.answers ?? null,
        bodyMapAreas: input.bodyMapAreas ?? null,
        emailSent: 0,
      };

      const result = await db.insert(stressLeads).values(leadData);
      const leadId = result[0].insertId;

      // Send email report
      const emailSent = await sendStressReport({
        name: input.name,
        email: input.email,
        score: input.score,
        stressLevel: input.stressLevel,
        tierTitle: input.tierTitle,
        tierId: input.tierId,
        tierSummary: input.tierSummary,
        primaryGuru: input.primaryGuru,
        secondaryGuru: input.secondaryGuru,
        domainAverages: input.domainAverages,
        bodyMapAreas: input.bodyMapAreas,
      });

      // Update email status
      if (emailSent) {
        await db
          .update(stressLeads)
          .set({ emailSent: 1 })
          .where(eq(stressLeads.id, leadId));
      }

      return {
        success: true,
        emailSent,
        leadId,
      };
    }),

  /**
   * Admin endpoint: List all stress leads with pagination.
   */
  list: adminProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(100).default(20),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { leads: [], total: 0 };

      const page = input?.page ?? 1;
      const limit = input?.limit ?? 20;
      const offset = (page - 1) * limit;

      const [leads, countResult] = await Promise.all([
        db
          .select()
          .from(stressLeads)
          .orderBy(desc(stressLeads.createdAt))
          .limit(limit)
          .offset(offset),
        db
          .select({ count: sql<number>`COUNT(*)` })
          .from(stressLeads),
      ]);

      return {
        leads,
        total: countResult[0]?.count ?? 0,
        page,
        limit,
        totalPages: Math.ceil((countResult[0]?.count ?? 0) / limit),
      };
    }),

  /**
   * Admin endpoint: Get a single lead by ID.
   */
  getById: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const result = await db
        .select()
        .from(stressLeads)
        .where(eq(stressLeads.id, input.id))
        .limit(1);

      return result[0] ?? null;
    }),

  /**
   * Admin endpoint: Get summary stats.
   */
  stats: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { total: 0, emailsSent: 0, avgScore: 0, tierBreakdown: {} };

    const [totalResult, emailsSentResult, avgScoreResult, tierResult] = await Promise.all([
      db.select({ count: sql<number>`COUNT(*)` }).from(stressLeads),
      db.select({ count: sql<number>`COUNT(*)` }).from(stressLeads).where(eq(stressLeads.emailSent, 1)),
      db.select({ avg: sql<number>`AVG(score)` }).from(stressLeads),
      db.select({
        tierTitle: stressLeads.tierTitle,
        count: sql<number>`COUNT(*)`,
      }).from(stressLeads).groupBy(stressLeads.tierTitle),
    ]);

    const tierBreakdown: Record<string, number> = {};
    for (const row of tierResult) {
      tierBreakdown[row.tierTitle] = row.count;
    }

    return {
      total: totalResult[0]?.count ?? 0,
      emailsSent: emailsSentResult[0]?.count ?? 0,
      avgScore: Math.round(avgScoreResult[0]?.avg ?? 0),
      tierBreakdown,
    };
  }),

  /**
   * Admin endpoint: Export leads as CSV data.
   */
  exportCsv: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { csv: "" };

    const leads = await db
      .select()
      .from(stressLeads)
      .orderBy(desc(stressLeads.createdAt));

    const headers = ["ID", "Name", "Email", "Score", "Stress Level", "Tier", "Primary Guru", "Secondary Guru", "Email Sent", "Date"];
    const rows = leads.map((l) => [
      l.id,
      `"${(l.name || "").replace(/"/g, '""')}"`,
      `"${(l.email || "").replace(/"/g, '""')}"`,
      l.score,
      l.stressLevel,
      `"${l.tierTitle}"`,
      `"${l.primaryGuru}"`,
      `"${l.secondaryGuru || ""}"`,
      l.emailSent ? "Yes" : "No",
      l.createdAt ? new Date(l.createdAt).toISOString() : "",
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    return { csv };
  }),

  /**
   * Admin endpoint: Resend report email for a specific lead.
   */
  resendEmail: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(stressLeads)
        .where(eq(stressLeads.id, input.id))
        .limit(1);

      const lead = result[0];
      if (!lead) throw new Error("Lead not found");

      const emailSent = await sendStressReport({
        name: lead.name,
        email: lead.email,
        score: lead.score,
        stressLevel: lead.stressLevel,
        tierTitle: lead.tierTitle,
        tierId: lead.tierId,
        tierSummary: "", // Will use default tier summary
        primaryGuru: lead.primaryGuru,
        secondaryGuru: lead.secondaryGuru ?? undefined,
        domainAverages: (lead.domainAverages as Record<string, number>) ?? {},
        bodyMapAreas: (lead.bodyMapAreas as string[]) ?? undefined,
      });

      if (emailSent) {
        await db
          .update(stressLeads)
          .set({ emailSent: 1 })
          .where(eq(stressLeads.id, input.id));
      }

      return { success: emailSent };
    }),
});
