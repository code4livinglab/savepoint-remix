import { z } from "zod";

export const schema = z.object({
  name: z.string().min(1),
  description: z.string().min(1).max(140),
  reason: z.string().min(1).max(140),
  file: z
    .custom<File>()
    .refine((file: File) => {
      return file.type === 'application/zip' || file.name.endsWith('.zip')
    }, {
      message: 'The file must be in ZIP format.',
      path: ['file'],
    })
    .refine((file: File) => {
      const MAX_SIZE = 16_000_000_000  // 16GB
      return file.size <= MAX_SIZE;
    }, {
      message: 'File size must be less than 5 GB.',
      path: ['file'],
    }),
});
