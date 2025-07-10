import { Request, Response } from "express";
import { prismaClient } from "@repo/db/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: "Name, email, and password are required" });
    return;
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const signup = await prismaClient.signup.create({
      data: { name, email, password: hashedPassword }
    });
    const token = jwt.sign(
      { id: signup.id, email: signup.email, name: signup.name },
      process.env.JWT_SECRET || "default_secret"
    );
    res.status(201).json({ signup, token });
  } catch (e: any) {
    if (e.code === 'P2002') {
      res.status(409).json({ error: "Email already exists" });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const signin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }
  try {
    const signup = await prismaClient.signup.findUnique({ where: { email } });
    if (!signup) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, signup.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }
    const token = jwt.sign(
      { id: signup.id, email: signup.email, name: signup.name },
      process.env.JWT_SECRET || "default_secret"
    );
    res.status(200).json({ signup, token });
  } catch (e) {
    res.status(500).json({ error: "Internal server error" });
  }
};
