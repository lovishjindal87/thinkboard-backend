import express from "express";
import { googleOAuthStart, googleOAuthCallback, getCurrentUser, logout } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/google", googleOAuthStart);
router.get("/google/callback", googleOAuthCallback);
router.get("/me", requireAuth, getCurrentUser);
router.post("/logout", logout);

export default router;


