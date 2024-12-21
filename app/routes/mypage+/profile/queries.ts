import { prisma } from "@/prisma"
import { User } from "@/types"

export const getUser = async (userId: string) => {
  try {
    const user: User | null = await prisma.user.findUnique({ where: { id: userId } })
    return user
  } catch (error) {
    console.error({ error })
    throw new Response("DB操作に失敗しました", { status: 500 })
  }
}
