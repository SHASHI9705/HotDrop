import { Request, Response } from "express";
import { prismaClient } from "@repo/db/client";

export const createFeedback = async (req: Request, res: Response) => {
  const { orderId, name, stars, comment } = req.body;
  if (!orderId || !name || !stars || !comment) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (typeof stars !== "number" || stars < 1 || stars > 5) {
    return res.status(400).json({ error: "Stars must be an integer between 1 and 5" });
  }
  try {
    // Find the order and partner
    const order = await prismaClient.order.findUnique({ where: { id: orderId } });
    if (!order) return res.status(404).json({ error: "Order not found" });
    const partnerId = order.partnerId;
    // Create feedback
    const feedback = await prismaClient.feedback.create({
      data: {
        orderId,
        partnerId,
        name,
        stars,
        comment,
      },
    });
    res.status(201).json({ feedback });
  } catch (err) {
    res.status(500).json({ error: "Failed to create feedback", details: String(err) });
  }
};
