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
  const { name, email, oldEmail } = req.body;

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
      data: { name, email },
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
