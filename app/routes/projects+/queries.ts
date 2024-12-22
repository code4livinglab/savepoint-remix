import { embed } from 'ai'
import pgvector from 'pgvector'
import { openai } from '@ai-sdk/openai'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { prisma } from "@/prisma";
import { s3Client } from "@/s3-client";
import { 
  Project,
  ProjectCreate,
  ProjectUser,
  ProjectUserCreate,
} from "@/types";

// プロジェクト一覧取得
export const getProjectList = async () => {
  try {
    const rawProjectList = await prisma.$queryRaw`
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

  // ベクトルを文字列から数値に変換
  const projectList: Project[] = rawProjectList.map((project: any) => {
    const stringEmbedding = project.embedding.toString().replace(/[\[\]]/g, '').split(',')
    const embedding = stringEmbedding.map((str: string) => parseFloat(str))
    return { ...project, embedding }
  })

    return projectList
  } catch (error) {
    console.error({ error })
    throw new Response("DB操作に失敗しました", { status: 500 })
  }
}

// プロジェクト詳細取得
export const getProject = async (id: string) => {
  try {
    const rawProjectList = await prisma.$queryRaw`
SELECT
  id,
  name,
  description,
  embedding::text,
  created,
  updated
FROM
  public."Project"
WHERE
  id = ${id}
`

  //　エラーハンドリング
  if (rawProjectList.length < 1) {
    throw new Response("プロジェクトが存在しません", { status: 404 })
  }

  // ベクトルを文字列から数値に変換
  const rawProject = rawProjectList[0]
  const stringEmbedding = rawProject.embedding.toString().replace(/[\[\]]/g, '').split(',')
  const embedding = stringEmbedding.map((str: string) => parseFloat(str))

  const project: Project = { ...rawProject, embedding }
  return project
  } catch (error) {
    console.error({ error })
    throw new Response("DB操作に失敗しました", { status: 500 })
  }
}

// プロジェクト作成
export const createProject = async (data: ProjectCreate) => {
  try {
    // Projectのインサート
    const embeddingString = pgvector.toSql(data.embedding);
    const result: number = await prisma.$executeRaw`
INSERT INTO
  public."Project" (
    id,
    name,
    description,
    embedding
  ) VALUES (
    ${data.id},
    ${data.name},
    ${data.description},
    ${embeddingString}::vector
  )
`;

  // プロジェクト詳細取得
  const project = await getProject(data.id)
  return project
  } catch (error) {
    console.error({ error })
    throw new Response("DB操作に失敗しました", { status: 500 })
  }
}

// プロジェクトユーザー作成
export const createProjectUser = async (data: ProjectUserCreate) => {
  try {
    const projectUser: ProjectUser = await prisma.projectUser.create({ data });
    return projectUser
  } catch (error) {
    console.error({ error })
    throw new Response("DB操作に失敗しました", { status: 500 })
  }
}

// エンベディング取得
export const getEmbedding = async (text: string) => {
  try {
    const { embedding } = await embed({
      model: openai.embedding("text-embedding-ada-002"),
      value: text,
    });

    return embedding
  } catch (error) {
    console.error({ error })
    throw new Response("OpenAI APIの利用に失敗しました", { status: 500 })
  }
}

// ファイルのアップロード
export const uploadFiles = async (projectId: string, files: File[]) => {
  try {
    const dirKey = `projects/${projectId}/`;

    for (const file of files) {
      const fileBuffer = await file.arrayBuffer();
      const fileKey = `${dirKey}${file.name}`;
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.BUCKET_NAME_RAW,
          Key: fileKey,
          Body: Buffer.from(fileBuffer),
        })
      );
    }
  } catch (error) {
    console.error({ error })
    throw new Response("S3操作に失敗しました", { status: 500 })
  }
}
