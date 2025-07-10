import express from "express";
import { getUserByEmail, updateUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUserByEmail); // GET /user
router.put("/update", updateUser); // PUT /user/update

export default router;
