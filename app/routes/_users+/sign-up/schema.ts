import { z } from "zod";
import { prisma } from "@/prisma"

export const schema = z.object({
  id: z
    .string()
    .min(1)
    .max(16)
    .toLowerCase()
    .refine(async (id) => {
      const user = await prisma.user.findFirst({ where: { id }})
      return user === null
    }, { message: 'Already used' }),
  name: z
    .string()
    .min(1)
    .max(16),
  email: z
    .string()
    .email()
    .refine(async (email) => {
      const user = await prisma.user.findFirst({ where: { email }})
      return user === null
    }, { message: 'Already used' }),
  password: z
    .string()
    .min(8)
    .max(32),
  confirmPassword: z
    .string()
    .min(8)
    .max(32),
  termsAndPolicies: z.literal("on"),
}).refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
