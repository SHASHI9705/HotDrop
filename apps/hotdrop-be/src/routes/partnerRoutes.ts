import express, { Router } from "express";
import { createBankAccount } from "../controllers/bankController.js";
import {
  partnerSignup,
  partnerSignin,
  updatePartner,
  getPartnerById,
  uploadShopImage,
  verifyPartner,
  getVerificationStatus,
} from "../controllers/partnerController.js";
import { upload } from "../config/multer.js";

const router: Router = express.Router();

// POST /partner/bank
router.post("/bank", createBankAccount);

router.post("/signup", partnerSignup);
router.post("/signin", partnerSignin);
router.put("/update", updatePartner);
router.get("/", getPartnerById);
router.post("/shopimage", upload.single("image"), uploadShopImage);
router.post("/verification", verifyPartner);
router.get("/verification/status", getVerificationStatus);

export default router;
