import { z } from "zod";

export const schema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  reason: z.string().min(1),
  files: z
    .custom<File>()
    .array()
    .min(1)
    .refine((files: File[]) => {
      // TODO: ZIPにしたらファイルサイズを確認
      return true
    }, {
      message: 'File size must be less than 5 GB.',
      path: ['files'],
    }),
});
