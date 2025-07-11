import express, { Router } from "express";
import { getUserByEmail, updateUser, deleteUser } from "../controllers/userController.js";

const router: Router = express.Router();

router.get("/", getUserByEmail); // GET /user
router.put("/update", updateUser); // PUT /user/update
router.delete("/delete", deleteUser); // DELETE /user/delete

export default router;
