import express from "express";
import { toggleMode, getMode } from "../controllers/adminController.js";

const router = express.Router();

router.post("/toggle-mode", toggleMode);
router.get("/mode", getMode);

export default router;