import { Request, Response } from "express";
import { prismaClient } from "@repo/db/client";

// POST /partner/bank
export const createBankAccount = async (req: Request, res: Response) => {
  try {
    const { accountNumber, ifscCode, cardHolderName, accountId , partnerId} = req.body;
    const bankAccount = await prismaClient.bankAccount.create({
      data: {
        accountNumber,
        ifscCode,
        cardHolderName,
        accountId: accountId || "",
        partner: { connect: { id: partnerId } },
      },
    });
    res.status(201).json(bankAccount);
  } catch (error) {
    res.status(500).json({ error: "Failed to create bank account" });
  }
};
