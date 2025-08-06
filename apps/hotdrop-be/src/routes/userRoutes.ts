
import express, { Router } from "express";
import { saveUserPushSubscription, getUserByEmail, updateUser, deleteUser, sendPromoPushToAllUsers } from "../controllers/userController.js";

const router: Router = express.Router();

// Route to send promo push notification to all users
router.post("/send-promo-push", (req, res, next) => {
  Promise.resolve(sendPromoPushToAllUsers(req, res)).catch(next);
});

// Add route to save user push subscription
router.post("/push-subscription", (req, res, next) => {
  Promise.resolve(saveUserPushSubscription(req, res)).catch(next);
});
router.get("/", getUserByEmail); // GET /user
router.put("/update", updateUser); // PUT /user/update
router.delete("/delete", deleteUser); // DELETE /user/delete

export default router;
