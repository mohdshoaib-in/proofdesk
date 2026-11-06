
import prisma from "../config/prisma";
import bcrypt from "bcryptjs";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import type { RegisterInput, LoginInput } from "../validators/auth.validator";

// Custom error class for authentication errors
export class AuthServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = "AuthServiceError";
  }
}

// Get JWT configuration from environment variables
const getJwtConfig = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  const expiresIn = (process.env.JWT_EXPIRES_IN ||
    "1d") as SignOptions["expiresIn"];

  return { secret: secret as Secret, expiresIn };
};

// Validate bcrypt's 72-byte password limit
const validatePasswordLength = (password: string): void => {
  if (Buffer.byteLength(password, "utf8") > 72) {
    throw new AuthServiceError(
      "Password cannot exceed 72 bytes",
      400
    );
  }
};

// Generate JWT access token
const generateToken = (userId: string): string => {
  const { secret, expiresIn } = getJwtConfig();

  return jwt.sign(
    { sub: userId },
    secret,
    { expiresIn }
  );
};

// Register a new user
export const registerUser = async (input: RegisterInput) => {
  validatePasswordLength(input.password);

  // Check whether the email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw new AuthServiceError(
      "An account with this email already exists",
      409
    );
  }

  // Hash password before saving
  const passwordHash = await bcrypt.hash(input.password, 12);

  try {
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    // Return user details and JWT
    return {
      user,
      token: generateToken(user.id),
    };
  } catch (error) {
    // Handle duplicate email race conditions
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AuthServiceError(
        "An account with this email already exists",
        409
      );
    }

    throw error;
  }
};

// Login an existing user
export const loginUser = async (input: LoginInput) => {
  validatePasswordLength(input.password);

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user || !user.isActive) {
    throw new AuthServiceError(
      "Invalid email or password",
      401
    );
  }

  // Compare entered password with stored hash
  const isPasswordValid = await bcrypt.compare(
    input.password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw new AuthServiceError(
      "Invalid email or password",
      401
    );
  }

  // Return safe user details and JWT
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
    token: generateToken(user.id),
  };
};
