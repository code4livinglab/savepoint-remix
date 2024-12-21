import { prisma } from "@/prisma";
import { Project } from "@/types";

// プロジェクト一覧を取得
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
