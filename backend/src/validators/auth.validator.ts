
import { z } from "zod";

// Registration validation
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(72, "Password cannot exceed 72 characters"),
});

// Login validation
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(1, "Password is required")
    .max(72, "Invalid password"),
});

// Export inferred TypeScript types
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
