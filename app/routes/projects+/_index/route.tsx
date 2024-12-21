import { embed } from 'ai'
import { randomUUID } from 'crypto'
import pgvector from 'pgvector'
import { openai } from '@ai-sdk/openai'
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node"
import { Outlet, useLoaderData } from "@remix-run/react"
import { AppBar } from "@/components/app-bar"
import { prisma } from "@/prisma"
import { authorizeClient } from '@/sessions.server'
import { Explore } from "./components/explore"
import { getProjectList } from "./queries"
import { reduceProjectDimension } from "./utils"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authorizeClient(request);

  // プロジェクト一覧を取得
  const rawProjectList = await getProjectList();
  const projectList = reduceProjectDimension(rawProjectList)  // 次元削減
  return { projectList }
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();

  // ペイロード
  const id = randomUUID();
  const description = `## プロジェクト概要

${body.get("description")}

## プロジェクトをセーブした理由

${body.get("reason")}
`;

  try {

    // エンべディング
    const { embedding } = await embed({
      model: openai.embedding("text-embedding-ada-002"),
      value: description,
    });

    // Projectのインサート
    const embeddingString = pgvector.toSql(embedding);
    const result: number = await prisma.$executeRaw`
INSERT INTO
  public."Project" (
    id,
    name,
    description,
    embedding
  ) VALUES (
    ${id},
    ${body.get("name")},
    ${description},
    ${embeddingString}::vector
  )
`;

    // projectUserのインサート
    // const session = await auth();
    // const userId = session?.user?.id;
    // if (!userId) {
    //   throw new Error("Failed to add role: User ID is null or undefined");
    // }

    await prisma.projectUser.create({
      data: {
        // userId: userId,
        userId: "userId",
        projectId: id,
        role: "OWNER",
      },
    });

    // ファイルのアップロード
    // const dirKey = `projects/${id}/`;
    // for (const file of body.get("files")) {
    //   const fileBuffer = await file.arrayBuffer();
    //   const fileKey = `${dirKey}${file.name}`;
    //   await s3Client.send(
    //     new PutObjectCommand({
    //       Bucket: process.env.BUCKET_NAME_RAW,
    //       Key: fileKey,
    //       Body: Buffer.from(fileBuffer),
    //     })
    //   );
    // }
  } catch (error) {
    console.log({ error });
    return {
      status: false,
      message: '内部エラーが発生しました。開発者にお問合せください。'
    }
  }

  redirect(`/projects/${id}`);
}

export default function ProjectList() {
  const { projectList } = useLoaderData<typeof loader>()

  return (
    <div className="relative h-dvh">
      <Explore projectList={projectList} />
      <AppBar />
      <Outlet />
    </div>
  )
}
