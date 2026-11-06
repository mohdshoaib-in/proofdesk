
import { Request, Response } from "express";
import prisma from "../config/prisma";

// Check whether the backend and database are working
export const getHealth = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    // Execute a real query against Neon PostgreSQL
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      message: "ProofDesk backend is running successfully",
      service: "ProofDesk API",
      database: "Connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    res.status(503).json({
      success: false,
      message: "Backend is running, but database connection failed",
      database: "Disconnected",
      timestamp: new Date().toISOString(),
    });
  }
};
