import { GetObjectCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3'
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { prisma } from '@/prisma'
import { ProjectRead } from '@/types'
import { ProjectCard } from './project-card'
import { ProjectList } from './project-list'

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const bucketName = process.env.BUCKET_NAME_RAW;
  const bucketRegion = process.env.BUCKET_REGION;
  const identityPoolId = process.env.IDENTITY_POOL_ID as string;
  const projectsKey = "projects/";

  const client = new S3Client({
    region: bucketRegion,
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: bucketRegion },
      identityPoolId: identityPoolId,
    }),
  });

  try {
    // プロジェクトを取得
    const projectList: ProjectRead[] = await prisma.$queryRaw`
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
  id = ${params.projectId}
`

  const project = projectList[0]

  // 類似プロジェクトを取得
  const recommendedProjectList: ProjectRead[] = await prisma.$queryRaw`
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

  // プロジェクトに紐付くファイルを取得
  const projectUri = projectsKey + project.id;
  const filesData = await client.send(
    new ListObjectsV2Command({
      Bucket: bucketName,
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

  return { project, recommendedProjectList, fileList }
  } catch (error) {
    console.error({ error })
    throw new Response("プロジェクトが見つかりません", { status: 404 });
  }
}

export const action = async ({ params }: ActionFunctionArgs) => {
  const bucketName = process.env.BUCKET_NAME_RAW;
  const bucketRegion = process.env.BUCKET_REGION;
  const identityPoolId = process.env.IDENTITY_POOL_ID as string;
  const projectsKey = "projects/";

  const client = new S3Client({
    region: bucketRegion,
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: bucketRegion },
      identityPoolId: identityPoolId as string,
    }),
  });

  const projectUri = projectsKey + params.projectId;
  const filesData = await client.send(
    new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: projectUri,
    })
  );

  const filePromises = filesData.Contents?.map(async (file) => {
    const fileData = await client.send(
      new GetObjectCommand({
        Bucket: bucketName,
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
}

export default function ProjectDetails() {
  const { project, recommendedProjectList, fileList } = useLoaderData<typeof loader>()
  
  return (
    <div className="flex justify-between mx-8">
      <ProjectList projectList={recommendedProjectList} />
      <ProjectCard project={project} fileList={fileList} />
    </div>
  )
}
