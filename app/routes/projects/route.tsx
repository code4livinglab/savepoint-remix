import { embed } from 'ai'
import { randomUUID } from 'crypto'
import pgvector from 'pgvector'
import { openai } from '@ai-sdk/openai'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers'
import { ActionFunctionArgs, json, redirect } from "@remix-run/node"
import { Outlet, useLoaderData } from "@remix-run/react"
import { AppBar } from "@/components/app-bar"
import { pca } from "@/lib/pca"
import { prisma } from "@/prisma"
import { Project, ProjectRead } from "@/types"
import { Explore } from "./explore"
// import { auth } from '../../auth'

const s3Client = new S3Client({
  region: import.meta.env.BUCKET_REGION,
  credentials: fromCognitoIdentityPool({
    clientConfig: { region: import.meta.env.BUCKET_REGION },
    identityPoolId: import.meta.env.IDENTITY_POOL_ID as string,
  }),
});

export const loader = async () => {
  try {
    // プロジェクト一覧を取得
    const textProjectList: ProjectRead[] = await prisma.$queryRaw`
SELECT
  id,
  name,
  description,
  embedding::text,
  created,
  updated
FROM
  public."Project"
`

    // ベクトルの形式を変換
    const numberProjectList: Project[] = textProjectList.map((project) => {
      const stringEmbedding = project.embedding.toString().replace(/[\[\]]/g, '').split(',')
      const embedding = stringEmbedding.map((str) => parseFloat(str))
      return { ...project, embedding }
    })

    // 次元削減
    const embeddings = numberProjectList.map((project) => project.embedding)
    const components = pca(embeddings)
    const projectList: Project[] = numberProjectList.map((project: any, i: number) => {
      project.embedding = components[i].slice(0, 3)
      return project
    })

    return json({ projectList })

  } catch (error) {
    console.error({ error })
    throw new Response("内部エラー", { status: 500 });
  }
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
    //       Bucket: import.meta.env.BUCKET_NAME_RAW,
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
