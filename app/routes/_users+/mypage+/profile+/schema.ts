import { z } from "zod";
import { prisma } from "@/prisma"

export const schema = z.object({
  id: z
    .string()
    .min(1)
    .max(16)
    .toLowerCase(),
  name: z
    .string()
    .min(1)
    .max(16),
  email: z
    .string()
    .email(),
});
