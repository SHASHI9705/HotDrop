

import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const getCoupon = async (req: Request, res: Response) => {
  const { coupon } = req.params;
  try {
    const found = await prisma.coupon.findFirst({
      where: { coupon },
    });
    if (!found) return res.status(404).json({ error: 'Coupon not found' });
    return res.json(found);
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};

export const useCoupon = async (req: Request, res: Response) => {
  const { coupon } = req.params;
  try {
    const found = await prisma.coupon.findFirst({ where: { coupon } });
    if (!found) return res.status(404).json({ error: 'Coupon not found' });
    if (found.used) return res.status(400).json({ error: 'Coupon already used' });
    const updated = await prisma.coupon.update({
      where: { id: found.id },
      data: { used: true },
    });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};

// Use coupon for a user (once per user)
export const useCouponForUser = async (req: Request, res: Response) => {
  const { coupon } = req.params;
  const userId = req.body.userId;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });
  try {
    const found = await prisma.coupon.findFirst({ where: { coupon } });
    if (!found) return res.status(404).json({ error: 'Coupon not found' });
    // Check if user already used this coupon
    const usage = await prisma.couponUsage.findUnique({
      where: { userId_couponId: { userId, couponId: found.id } }
    });
    if (usage && usage.used) {
      return res.status(400).json({ error: 'Coupon already used by this user' });
    }
    // Mark as used for this user
    const newUsage = await prisma.couponUsage.upsert({
      where: { userId_couponId: { userId, couponId: found.id } },
      update: { used: true, usedAt: new Date() },
      create: { userId, couponId: found.id, used: true, usedAt: new Date() }
    });
    return res.json({ coupon: found, usage: newUsage });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};

// GET: Check if user has used a coupon
export const checkCouponUsage = async (req: Request, res: Response) => {
  const { coupon } = req.params;
  const userId = req.query.userId as string;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });
  try {
    const found = await prisma.coupon.findFirst({ where: { coupon } });
    if (!found) return res.status(404).json({ error: 'Coupon not found' });
    const usage = await prisma.couponUsage.findUnique({
      where: { userId_couponId: { userId, couponId: found.id } }
    });
    return res.json({ usage });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};