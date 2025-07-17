import express, { Router } from "express";
import { createOrder, markOrderDelivered, getOrders, cancelOrder, setOrderTimer } from "../controllers/orderController.js";
import { splitPayment } from "../controllers/splitController.js";

const router: Router = express.Router();

router.post("/order", createOrder);
router.post("/order/split", splitPayment as any);
router.patch("/order/:orderId/delivered", markOrderDelivered);
router.patch("/order/:orderId/cancel", cancelOrder);
router.patch("/order/:orderId/timer", setOrderTimer);
router.get("/orders", getOrders);

export default router;
