import { compare } from "bcrypt";
import { z } from "zod";
import { findUserByEmail } from "../queries";

export const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})
.refine(async ({ email, password }) => {
  const user = await findUserByEmail(email)

  // ユーザーが存在しない場合
  if (user === null) {
    return false
  }

  // パスワードが一致しない場合
  const isMatch = await compare(password, user.password);
  if (!isMatch) {
    return false
  }

  return true
}, {
  message: 'Email or password is incorrect',
  path: ['password'],
});
