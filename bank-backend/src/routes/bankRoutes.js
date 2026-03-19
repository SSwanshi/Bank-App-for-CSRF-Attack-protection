import express from "express";
import { transfer, getBalance } from "../controllers/bankController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { verifyCSRF } from "../middleware/csrfMiddleware.js";
import { checkMode } from "../middleware/modeMiddleware.js";

const router = express.Router();

// Apply auth to all
router.use(isAuthenticated);

// Transfer (conditionally protected)
router.post(
  "/transfer",
  checkMode,
  (req, res, next) => {
    if (req.securityMode === "protected") {
      return verifyCSRF(req, res, next);
    }
    next();
  },
  transfer
);

router.get("/balance", getBalance);

export default router;