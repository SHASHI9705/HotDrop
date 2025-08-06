import { sendPushToUser } from "../controllers/pushUtils.js";
// Send promo push notification to all users with a push subscription
export const sendPromoPushToAllUsers = async (req: Request, res: Response) => {
  try {
    // Find all users with at least one push subscription and promoUpdatesEnabled true
    const users = await prismaClient.signup.findMany({
      where: {
        promoUpdatesEnabled: true,
        pushSubscriptions: {
          some: {},
        },
      },
      select: { id: true },
    });
    if (!users.length) return res.status(200).json({ message: "No users with promo updates enabled" });

    const messages = [
      "Craving hits different when you're on the move! Pre-order on Hotdrop now!",
      "Why wait hungry? Order now, grab on the go!",
      "Feeling hungry? Hotdrop's got your back, order while you're on the way!",
      "Your cravings are waiting... skip the queue, bite into flavor with Hotdrop!",
      "No time? No problem. Pre-order your hunger fix with Hotdrop!",
      "Traffic’s slow, but your food won’t be... pre-order on Hotdrop!",
      "Turn red lights into snack time, order on the go!",
      "Spice up your ride! Order now, pick up hot!",
      "Hunger doesn't wait, neither should you. Order ahead with Hotdrop!",
      "Your food. Your route. skip waiting. Just Hotdrop it!",
    ];
    
    let sent = 0;
    for (const user of users) {
      const randomIndex = Math.floor(Math.random() * messages.length);
      const payload = {
      title: "HotDrop",
      body: messages[randomIndex],
      icon: "/logo.png",
      url: "https://hotdrop.tech"
    };
      await sendPushToUser(user.id, payload);
      sent++;
    }
    res.status(200).json({ message: `Promo push sent to ${sent} users` });
  } catch (err) {
    res.status(500).json({ error: "Failed to send promo push", details: String(err) });
  }
};
import { Request, Response } from "express";
import { prismaClient } from "@repo/db/client";

// Save push subscription for user
export const saveUserPushSubscription = async (req: Request, res: Response) => {
  const { userId, subscription } = req.body;
  if (!userId || !subscription || !subscription.endpoint || !subscription.keys) {
    return res.status(400).json({ error: 'Missing userId or subscription' });
  }
  try {
    // Upsert: update if exists, else create
    await prismaClient.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: {
        userId,
        keys: subscription.keys,
      },
      create: {
        userId,
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      },
    });
    res.status(201).json({ message: 'Subscription saved or updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save subscription' });
  }
};

export const getUserByEmail = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.query;

  if (!email) {
    res.status(400).json({ error: "Email is required" });
    return;
  }

  try {
    const user = await prismaClient.signup.findUnique({
      where: { email: String(email) },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    res.status(200).json({ user: userWithoutPassword });
  } catch (e) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, oldEmail, promoUpdatesEnabled } = req.body;

  if (!name || !email || !oldEmail) {
    res.status(400).json({ error: "Name, email, and oldEmail are required" });
    return;
  }

  try {
    if (email !== oldEmail) {
      const existing = await prismaClient.signup.findUnique({ where: { email } });
      if (existing) {
        res.status(409).json({ error: "Email already exists" });
        return;
      }
    }

    const updated = await prismaClient.signup.update({
      where: { email: oldEmail },
      data: { name, email, ...(promoUpdatesEnabled !== undefined ? { promoUpdatesEnabled } : {}) },
    });

    res.status(200).json({ user: updated });
  } catch (e) {
    res.status(500).json({ error: "Failed to update user", details: String(e) });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: "Email is required" });
    return;
  }
  try {
    const user = await prismaClient.signup.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    await prismaClient.signup.delete({ where: { email } });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: "Failed to delete user", details: String(e) });
  }
};
