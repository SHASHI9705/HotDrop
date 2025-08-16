import { Router } from 'express';
import { getCoupon, useCoupon } from '../controllers/couponController.js';

const router = Router();

// GET /coupon/:coupon - fetch coupon details (including percent)
router.get('/:coupon', getCoupon as any);

// POST /coupon/:coupon/use - mark coupon as used
router.post('/:coupon/use', useCoupon as any);

export default router;
