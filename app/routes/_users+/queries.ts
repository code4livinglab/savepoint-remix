import { prisma } from "@/prisma"
import { User, UserCreate } from "@/types";

// ユーザー取得（ユーザーID）
export const findUserById = async (id: string) => {
  try {
    const prismaUser = await prisma.user.findUnique({ where: { id } });
    
    if (!prismaUser) {
      return null;
    }

    const user: User = {
      ...prismaUser,
      created: prismaUser.created.toISOString(),
      updated: prismaUser.updated.toISOString(),
    };

    return user;
  } catch (error) {
    console.error({ error });
    throw new Response("DB操作に失敗しました", { status: 500 });
  }
}

// ユーザー取得（メールアドレス）
export const findUserByEmail = async (email: string) => {
  try {
    const prismaUser = await prisma.user.findFirst({ where: { email }});
    
    if (!prismaUser) {
      return null;
    }

    const user: User = {
      ...prismaUser,
      created: prismaUser.created.toISOString(),
      updated: prismaUser.updated.toISOString(),
    };

    return user;
  } catch (error) {
    console.error({ error });
    throw new Response("DB操作に失敗しました", { status: 500 });
  }
}

// ユーザー作成
export const createUser = async (data: UserCreate) => {
  try {
    const prismaUser = await prisma.user.create({ data });
    
    const user: User = {
      ...prismaUser,
      created: prismaUser.created.toISOString(),
      updated: prismaUser.updated.toISOString(),
    };

    return user;
  } catch (error) {
    console.error({ error });
    throw new Response("DB操作に失敗しました", { status: 500 });
  }
}

// ユーザー編集
export const updateUser = async (id: string, data: UserCreate) => {
  try {
    const prismaUser = await prisma.user.update({ where: { id }, data });
    
    const user: User = {
      ...prismaUser,
      created: prismaUser.created.toISOString(),
      updated: prismaUser.updated.toISOString(),
    };

    return user;
  } catch (error) {
    console.error({ error });
    throw new Response("DB操作に失敗しました", { status: 500 });
  }
}

// ユーザー削除
export const deleteUser = async (id: string) => {
  try {
    const prismaUser = await prisma.user.delete({ where: { id } });
    
    const user: User = {
      ...prismaUser,
      created: prismaUser.created.toISOString(),
      updated: prismaUser.updated.toISOString(),
    };

    return user;
  } catch (error) {
    console.error({ error });
    throw new Response("DB操作に失敗しました", { status: 500 });
  }
}
