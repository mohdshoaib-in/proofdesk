import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";

// Protect routes using JWT authentication
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Read Authorization header
    const authHeader = req.headers.authorization;

    // Check whether Bearer token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Authentication token is required",
      });
      return;
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify JWT secret configuration
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    // Verify token and decode payload
    const decoded = jwt.verify(token, secret);

    // Ensure token contains a valid user ID
    if (
      typeof decoded === "string" ||
      typeof decoded.sub !== "string"
    ) {
      res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
      return;
    }

    // Find active user in database
    const user = await prisma.user.findFirst({
      where: {
        id: decoded.sub,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // Reject token if user no longer exists or is inactive
    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not found or account is inactive",
      });
      return;
    }

    // Attach authenticated user to request
    req.user = user;

    // Continue to the protected route
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token",
      });
      return;
    }

    console.error("Authentication middleware error:", error);

    res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};