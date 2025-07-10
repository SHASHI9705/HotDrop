import express from "express";
import {
  getPartnerItems,
  getAllPartnersWithItems,
  getBurgerItems,
  toggleItemAvailability,
  deleteItem,
  addItem,
} from "../controllers/itemController.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.get("/partner/items", getPartnerItems);
router.get("/partners-with-items", getAllPartnersWithItems);
router.get("/partner/burger-items", getBurgerItems);
router.patch("/partner/item/:itemId/availability", toggleItemAvailability);
router.delete("/partner/item/:itemId", deleteItem);
router.post("/partner/items", upload.single("image"), addItem);

export default router;
