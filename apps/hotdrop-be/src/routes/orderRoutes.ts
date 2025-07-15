import express, { Router } from "express";
import { createOrder, markOrderDelivered, getOrders } from "../controllers/orderController.js";
import { splitPayment } from "../controllers/splitController.js";

const router: Router = express.Router();

router.post("/order", createOrder);
router.post("/order/split", splitPayment as any);
router.patch("/order/:orderId/delivered", markOrderDelivered);
router.get("/orders", getOrders);

export default router;
