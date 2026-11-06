
import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  AuthServiceError,
} from "../services/auth.service";
import {
  registerSchema,
  loginSchema,
} from "../validators/auth.validator";

// Register a new user
export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Validate request body
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.flatten().fieldErrors,
      });
      return;
    }

    // Register user through authentication service
    const result = await registerUser(validation.data);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: result,
    });
  } catch (error) {
    handleAuthError(error, res);
  }
};

// Login an existing user
export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Validate request body
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.flatten().fieldErrors,
      });
      return;
    }

    // Authenticate user
    const result = await loginUser(validation.data);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    handleAuthError(error, res);
  }
};

// Handle authentication errors consistently
const handleAuthError = (
  error: unknown,
  res: Response
): void => {
  if (error instanceof AuthServiceError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  console.error("Authentication error:", error);

  res.status(500).json({
    success: false,
    message: "An unexpected error occurred",
  });
};

// Get currently authenticated user's profile
export const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // User is attached by authenticate middleware
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve user profile",
    });
  }
};