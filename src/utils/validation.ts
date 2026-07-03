import { z } from 'zod';

/**
 * ValidationUtils
 *
 * Zod schemas for client-side validation of common operations.
 * Ensures consistency across SDK consumers.
 */

export const EmailSchema = z.string().email('Invalid email address');

export const PasswordSchema = z.string().min(8, 'Password must be at least 8 characters');

export const UsernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be at most 30 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscore, and dash');

export const AmountSchema = z.number().positive('Amount must be greater than 0');

export const PublicKeySchema = z.string().regex(/^G[A-Z0-9]{55}$/, 'Invalid Stellar public key');

export const SignupSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  name: z.string().optional(),
});

export const LoginSchema = z.object({
  email: EmailSchema,
  password: z.string(),
});

export const CreateTipSchema = z.object({
  creatorId: z.string().min(1, 'Creator ID is required'),
  amount: AmountSchema,
  message: z.string().optional(),
});

export const CreatorProfileSchema = z.object({
  username: UsernameSchema,
  description: z.string().max(500, 'Description must be at most 500 characters').optional(),
  isPublic: z.boolean().optional(),
});

export const WalletConnectionSchema = z.object({
  publicKey: PublicKeySchema,
  name: z.string().optional(),
});

export class ValidationUtils {
  static validateSignup(data: unknown): z.infer<typeof SignupSchema> {
    return SignupSchema.parse(data);
  }

  static validateLogin(data: unknown): z.infer<typeof LoginSchema> {
    return LoginSchema.parse(data);
  }

  static validateCreateTip(data: unknown): z.infer<typeof CreateTipSchema> {
    return CreateTipSchema.parse(data);
  }

  static validateCreatorProfile(data: unknown): z.infer<typeof CreatorProfileSchema> {
    return CreatorProfileSchema.parse(data);
  }

  static validateWalletConnection(data: unknown): z.infer<typeof WalletConnectionSchema> {
    return WalletConnectionSchema.parse(data);
  }

  static validateEmail(email: string): boolean {
    try {
      EmailSchema.parse(email);
      return true;
    } catch {
      return false;
    }
  }

  static validatePublicKey(publicKey: string): boolean {
    try {
      PublicKeySchema.parse(publicKey);
      return true;
    } catch {
      return false;
    }
  }
}
