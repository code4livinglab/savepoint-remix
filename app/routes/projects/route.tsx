import { Project, ProjectRead } from "@/types"
import { prisma } from "@/prisma"
import { json } from "@remix-run/node"
import { Outlet, useLoaderData } from "@remix-run/react"
import { pca } from "@/lib/pca"
import { Explore } from "./explore"
import { AppBar } from "@/components/app-bar"

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
