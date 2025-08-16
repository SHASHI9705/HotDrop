import express, { Router } from "express";
import { getCoupon, useCoupon, useCouponForUser, checkCouponUsage } from '../controllers/couponController.js';

const router: Router = express.Router();

// GET /coupon/:coupon/usage?userId=... - check if user has used coupon
router.get('/:coupon/usage', checkCouponUsage as any);

// GET /coupon/:coupon - fetch coupon details (including percent)
router.get('/:coupon', getCoupon as any);

// POST /coupon/:coupon/use - mark coupon as used
router.post('/:coupon/use', useCoupon as any);

// POST /coupon/:coupon/use/user - mark coupon as used for a user
router.post('/:coupon/use/user', useCouponForUser as any);

export default router;
