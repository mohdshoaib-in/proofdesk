
import { Request, Response } from "express";

export const getHealth = (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: "ProofDesk backend is running successfully",
    service: "ProofDesk API",
    timestamp: new Date().toISOString(),
  });
};
