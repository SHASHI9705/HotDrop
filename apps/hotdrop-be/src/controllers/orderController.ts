

import { Request, Response } from "express";
import { prismaClient } from "@repo/db/client";

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  const { userId, partnerId, items, shopName, price } = req.body;

  if (!userId || !partnerId || !items || !shopName || !price) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const user = await prismaClient.signup.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const partner = await prismaClient.partner.findUnique({ where: { id: partnerId } });
    if (!partner) {
      res.status(404).json({ error: "Partner not found" });
      return;
    }

    const order = await prismaClient.order.create({
      data: {
        userId,
        partnerId,
        items: typeof items === "string" ? items : JSON.stringify(items),
        shopName,
        price: parseFloat(price),
        dateTime: new Date(),
        status: "pending",
      },
    });

    res.status(201).json({ order });
  } catch (e) {
    res.status(500).json({ error: "Failed to create order", details: String(e) });
  }
};

// Set order timer (status as timer value)
export const setOrderTimer = async (req: Request, res: Response): Promise<void> => {
  const { orderId } = req.params;
  const { timer } = req.body; // timer should be a string like '5min', '10min', etc.
  if (!timer) {
    res.status(400).json({ error: "Timer value is required" });
    return;
  }
  try {
    const updated = await prismaClient.order.update({
      where: { id: orderId },
      data: { status: timer },
    });
    res.status(200).json({ order: updated });
  } catch (e) {
    res.status(500).json({ error: "Failed to set timer for order", details: String(e) });
  }
};

export const markOrderDelivered = async (req: Request, res: Response): Promise<void> => {
  const { orderId } = req.params;

  try {
    const updated = await prismaClient.order.update({
      where: { id: orderId },
      data: { status: "taken" },
    });

    res.status(200).json({ order: updated });
  } catch (e) {
    res.status(500).json({ error: "Failed to update order status", details: String(e) });
  }
};

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  const { userId, partnerId } = req.query;

  if (!userId && !partnerId) {
    res.status(400).json({ error: "userId or partnerId is required" });
    return;
  }

  try {
    const where: any = {};
    if (userId) where.userId = userId;
    if (partnerId) where.partnerId = partnerId;

    const orders = await prismaClient.order.findMany({
      where,
      orderBy: { dateTime: "desc" },
    });

    res.status(200).json({ orders });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch orders", details: String(e) });
  }
};

export const cancelOrder = async (req: Request, res: Response): Promise<void> => {
  const { orderId } = req.params;
  try {
    const updated = await prismaClient.order.update({
      where: { id: orderId },
      data: { status: "cancelled" },
    });
    res.status(200).json({ order: updated });
  } catch (e) {
    res.status(500).json({ error: "Failed to cancel order", details: String(e) });
  }
};