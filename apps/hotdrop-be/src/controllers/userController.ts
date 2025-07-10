import { Request, Response } from "express";
import { prismaClient } from "@repo/db/client";

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
