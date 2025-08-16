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
