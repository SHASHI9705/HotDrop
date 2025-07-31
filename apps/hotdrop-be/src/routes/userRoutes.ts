import { Router } from "express";
import { saveUserPushSubscription, getUserByEmail, updateUser, deleteUser } from "../controllers/userController.js";

const router = Router();

// Add route to save user push subscription
router.post("/push-subscription", (req, res, next) => {
  Promise.resolve(saveUserPushSubscription(req, res)).catch(next);
});
router.get("/", getUserByEmail); // GET /user
router.put("/update", updateUser); // PUT /user/update
router.delete("/delete", deleteUser); // DELETE /user/delete

export default router;
