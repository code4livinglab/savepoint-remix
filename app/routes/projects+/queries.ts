import { embed } from 'ai'
import pgvector from 'pgvector'
import { openai } from '@ai-sdk/openai'
import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
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
    const rawProjectList: any[] = await prisma.$queryRaw`
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

// 類似プロジェクト一覧取得
export const getRecommendedProjectList = async (project: Project) => {
  const recommendedProjectList: any[] = await prisma.$queryRaw`
SELECT
  id,
  name,
  description,
  1 - (embedding <=> ${project.embedding}::vector) AS similarity,
  created,
  updated
FROM
  public."Project"
WHERE
  id != ${project.id}
ORDER BY
  similarity DESC
LIMIT
  20
`

  return recommendedProjectList
}

// プロジェクト詳細取得
export const getProject = async (id: string) => {
  try {
    const rawProjectList: any[] = await prisma.$queryRaw`
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

// ファイルの取得
export const getFileList = async (projectId: string) => {
  try {
    // データの取得
    const projectUri = `projects/${projectId}`;
    const filesData = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: process.env.BUCKET_NAME_RAW,
        Prefix: projectUri,
      })
    );

    // ファイルの名称とサイズを取得
    let fileList: { name: string; size: string; url: string }[] = []
    if (filesData.Contents?.length) {
      fileList = filesData.Contents.map((file) => {
        const name = file.Key?.replace(`${projectUri}/`, "") ?? ""
        const size = file.Size
          ? (file.Size / (1000 )).toFixed(1) + " KB"
          : "0 MB"
        const url = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${projectUri}/${name}`

        return { name, size, url }
      }).filter((file) => file.name !== "")
    }

    return fileList
  } catch (error) {
    console.error({ error })
    throw new Response("S3操作に失敗しました", { status: 500 })
  }
}

// ファイルのアップロード
export const uploadFileList = async (projectId: string, files: File[]) => {
  try {
    const projectKey = `projects/${projectId}/`;

    for (const file of files) {
      const fileBuffer = await file.arrayBuffer();
      const fileKey = `${projectKey}${file.name}`;
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

// ファイルのダウンロード
export const downloadFileList = async (projectId: string) => {
  try {
    const projectUri = `projects/${projectId}`;
    const filesData = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: process.env.BUCKET_NAME_RAW,
        Prefix: projectUri,
      })
    );
  
    const filePromises = filesData.Contents?.map(async (file) => {
      const fileData = await s3Client.send(
        new GetObjectCommand({
          Bucket: process.env.BUCKET_NAME_RAW,
          Key: file.Key,
        })
      );
      
      if (fileData.Body) {
        const byteArray = await fileData.Body.transformToByteArray();  // Uint8Array
        return {
          key: file.Key,
          byteArray: byteArray,
          contentType: fileData.ContentType,
        };
      }
    });
  
    return await Promise.all(filePromises ?? []);
  } catch (error) {
    console.error({ error })
    throw new Response("S3操作に失敗しました", { status: 500 })
  }
}