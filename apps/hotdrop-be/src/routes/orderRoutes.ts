import express, { Router } from "express";
import { createOrder, markOrderDelivered, getOrders } from "../controllers/orderController.js";

const router: Router = express.Router();

router.post("/order", createOrder);
router.patch("/order/:orderId/delivered", markOrderDelivered);
router.get("/orders", getOrders);

export default router;
