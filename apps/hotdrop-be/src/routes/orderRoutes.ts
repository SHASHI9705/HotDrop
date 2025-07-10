import express from "express";
import { createOrder, markOrderDelivered, getOrders } from "../controllers/orderController.js";

const router = express.Router();

router.post("/order", createOrder);
router.patch("/order/:orderId/delivered", markOrderDelivered);
router.get("/orders", getOrders);

export default router;
