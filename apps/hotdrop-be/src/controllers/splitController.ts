import { Request, Response } from "express";
import { prismaClient } from "@repo/db/client";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// POST /order/split
export async function splitPayment(req: Request, res: Response) {
  try {
    const { orderId, partnerId, amount } = req.body;
    const gst = amount * 0.03 / 1.03; // GST is 3% of subtotal, so reverse-calculate
    const maintenance = 200;
    const partnerShare = Math.round(amount - gst - maintenance);

    // Fetch partner's bank account (with accountId)
    const bankAccount = await prismaClient.bankAccount.findUnique({
      where: { partnerId },
    });
    if (!bankAccount || !bankAccount.accountId) {
      return res.status(404).json({ error: "Partner bank account not found or not linked to Razorpay." });
    }
    // Create transfer to partner's sub-account
    const transfer = await razorpay.transfers.create({
      account: bankAccount.accountId,
      amount: partnerShare, // only partner's share
      currency: "INR",
      notes: { orderId },
    });
    // Optionally, save transfer info in DB
    res.status(201).json({ success: true, transfer, partnerShare });
  } catch (error: any) {
    console.error("Split Payment Error:", error);
    res.status(500).json({ error: error.message || "Failed to split payment" });
  }
};
