
import { Router } from "express";
import { getHealth } from "../controllers/health.controller";

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check backend health
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Backend is running successfully
 */
router.get("/", getHealth);

export default router;
