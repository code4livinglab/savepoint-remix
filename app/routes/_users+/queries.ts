import { prisma } from "@/prisma"
import { User, UserCreate } from "@/types";

// ユーザー取得（メールアドレス）
export const findUserByEmail = async (email: string) => {
  try {
    const user: User | null = await prisma.user.findFirst({ where: { email }})
    return user;
  } catch (error) {
    console.error({ error });
    throw new Response("DB操作に失敗しました", { status: 500 });
  }
}

// ユーザー作成
export const createUser = async (data: UserCreate) => {
  try {
    const user: User = await prisma.user.create({ data });
    return user;
  } catch (error) {
    console.error({ error });
    throw new Response("DB操作に失敗しました", { status: 500 });
  }
}
