"use server";

import db from "@/lib/db";
import { sendPayoutSettledEmail } from "@/lib/email";

export type PayoutStatus = "PENDING" | "SETTLED" | "REJECTED";

export interface PayoutRequestInfo {
  id: string;
  sellerId: string;
  companyName: string;
  amount: number;
  status: PayoutStatus;
  requestedAt: Date;
  settledAt?: Date | null;
  adminEmail?: string | null;
  notes?: string | null;
}

export interface SellerPayoutStats {
  totalSalesRevenue: number;
  pendingAmount: number;
  settledAmount: number;
  availableBalance: number;
}

// In-memory global array for mock payouts sandbox session
let mockPayoutRequests: PayoutRequestInfo[] = [
  {
    id: "pay-req-1",
    sellerId: "seller-1-profile",
    companyName: "EcoThreads Apparel",
    amount: 15000,
    status: "SETTLED",
    requestedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    settledAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    adminEmail: "admin@earthcentric.com",
    notes: "Settled via IMPS bank transfer.",
  },
  {
    id: "pay-req-2",
    sellerId: "seller-1-profile",
    companyName: "EcoThreads Apparel",
    amount: 8000,
    status: "PENDING",
    requestedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  }
];

export async function getSellerPayoutStats(sellerId: string): Promise<SellerPayoutStats> {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("mock")) {
      const sellerRequests = mockPayoutRequests.filter((p) => p.sellerId === sellerId);
      const pendingAmount = sellerRequests
        .filter((p) => p.status === "PENDING")
        .reduce((sum, p) => sum + p.amount, 0);
      const settledAmount = sellerRequests
        .filter((p) => p.status === "SETTLED")
        .reduce((sum, p) => sum + p.amount, 0);
      const totalSalesRevenue = 156900; // Match default mock stats revenue
      const availableBalance = Math.max(totalSalesRevenue - (pendingAmount + settledAmount), 0);

      return {
        totalSalesRevenue,
        pendingAmount,
        settledAmount,
        availableBalance,
      };
    }

    // Dynamic database lookup
    const completedItems = await db.orderItem.findMany({
      where: {
        product: {
          sellerId: sellerId,
        },
        order: {
          payment: {
            status: "COMPLETED",
          },
        },
      },
      select: {
        price: true,
        quantity: true,
      },
    });

    const totalSalesRevenue = completedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const payouts = await db.payoutRequest.findMany({
      where: { sellerId },
    });

    const pendingAmount = payouts
      .filter((p) => p.status === "PENDING")
      .reduce((sum, p) => sum + p.amount, 0);

    const settledAmount = payouts
      .filter((p) => p.status === "SETTLED")
      .reduce((sum, p) => sum + p.amount, 0);

    const availableBalance = Math.max(totalSalesRevenue - (pendingAmount + settledAmount), 0);

    return {
      totalSalesRevenue,
      pendingAmount,
      settledAmount,
      availableBalance,
    };
  } catch (error) {
    console.error("Failed to get seller payout stats, returning mock:", error);
    return {
      totalSalesRevenue: 156900,
      pendingAmount: 8000,
      settledAmount: 15000,
      availableBalance: 133900,
    };
  }
}

export async function requestPayout(sellerId: string, amount: number): Promise<{ success: boolean; error?: string }> {
  try {
    if (amount <= 0) {
      return { success: false, error: "Withdrawal amount must be greater than zero." };
    }

    const stats = await getSellerPayoutStats(sellerId);
    if (amount > stats.availableBalance) {
      return { success: false, error: "Insufficient withdrawable balance." };
    }

    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("mock")) {
      // Check twice a week rule (last 7 days rolling)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentRequests = mockPayoutRequests.filter(
        (p) => p.sellerId === sellerId && p.requestedAt >= sevenDaysAgo
      );

      if (recentRequests.length >= 2) {
        return { success: false, error: "Payout limit reached. You can only request payouts up to 2 times a week." };
      }

      mockPayoutRequests.push({
        id: `pay-req-${Math.random().toString(36).substring(2, 9)}`,
        sellerId,
        companyName: "EcoThreads Apparel", // Fallback company name for mock
        amount,
        status: "PENDING",
        requestedAt: new Date(),
      });

      return { success: true };
    }

    // Check twice a week rule (last 7 days rolling) in database
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dbRecentRequestsCount = await db.payoutRequest.count({
      where: {
        sellerId,
        requestedAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    if (dbRecentRequestsCount >= 2) {
      return { success: false, error: "Payout limit reached. You can only request payouts up to 2 times a week." };
    }

    // Get seller profile to log company name
    const seller = await db.seller.findUnique({
      where: { id: sellerId },
      select: { companyName: true },
    });

    await db.payoutRequest.create({
      data: {
        sellerId,
        amount,
        status: "PENDING",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to request payout:", error);
    return { success: false, error: "Failed to submit withdrawal request." };
  }
}

export async function getSellerPayoutRequests(sellerId: string): Promise<PayoutRequestInfo[]> {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("mock")) {
      return mockPayoutRequests
        .filter((p) => p.sellerId === sellerId)
        .sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime());
    }

    const requests = await db.payoutRequest.findMany({
      where: { sellerId },
      include: {
        seller: {
          select: { companyName: true },
        },
      },
      orderBy: {
        requestedAt: "desc",
      },
    });

    return requests.map((r) => ({
      id: r.id,
      sellerId: r.sellerId,
      companyName: r.seller.companyName,
      amount: r.amount,
      status: r.status as PayoutStatus,
      requestedAt: r.requestedAt,
      settledAt: r.settledAt,
      adminEmail: r.adminEmail,
      notes: r.notes,
    }));
  } catch (error) {
    console.error("Failed to get seller payout requests:", error);
    return [];
  }
}

export async function getAdminPayoutRequests(): Promise<PayoutRequestInfo[]> {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("mock")) {
      return mockPayoutRequests.sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime());
    }

    const requests = await db.payoutRequest.findMany({
      include: {
        seller: {
          select: { companyName: true },
        },
      },
      orderBy: {
        requestedAt: "desc",
      },
    });

    return requests.map((r) => ({
      id: r.id,
      sellerId: r.sellerId,
      companyName: r.seller.companyName,
      amount: r.amount,
      status: r.status as PayoutStatus,
      requestedAt: r.requestedAt,
      settledAt: r.settledAt,
      adminEmail: r.adminEmail,
      notes: r.notes,
    }));
  } catch (error) {
    console.error("Failed to get admin payout requests:", error);
    return [];
  }
}

export async function settlePayoutRequest(
  requestId: string,
  adminEmail: string,
  notes?: string
): Promise<boolean> {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("mock")) {
      mockPayoutRequests = mockPayoutRequests.map((p) => {
        if (p.id === requestId) {
          return {
            ...p,
            status: "SETTLED",
            settledAt: new Date(),
            adminEmail,
            notes: notes || "Settled in demo mode.",
          };
        }
        return p;
      });

      // Send payout settled email notification
      const settled = mockPayoutRequests.find((p) => p.id === requestId);
      if (settled) {
        await sendPayoutSettledEmail(
          "seller@earthcentric.com",
          settled.companyName,
          settled.amount,
          notes
        ).catch((err) => console.error("Failed to send payout email:", err));
      }
      return true;
    }

    const request = await db.payoutRequest.update({
      where: { id: requestId },
      data: {
        status: "SETTLED",
        settledAt: new Date(),
        adminEmail,
        notes,
      },
      include: {
        seller: { select: { companyName: true } },
      },
    });

    // Log to Audit Log
    await db.auditLog.create({
      data: {
        action: "SETTLE_PAYOUT",
        adminEmail,
        details: `Settled payout request of ₹${request.amount} for seller ${request.seller.companyName} (${request.sellerId}). Notes: ${notes || "None"}`,
      },
    });

    // Send payout settled email to seller
    const seller = await db.seller.findUnique({
      where: { id: request.sellerId },
      include: { user: { select: { email: true } } },
    });
    if (seller?.user?.email) {
      await sendPayoutSettledEmail(
        seller.user.email,
        request.seller.companyName,
        request.amount,
        notes
      ).catch((err) => console.error("Failed to send payout email:", err));
    }

    return true;
  } catch (error) {
    console.error("Failed to settle payout request:", error);
    return false;
  }
}
