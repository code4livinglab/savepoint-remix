import { LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { prisma } from '@/prisma'
import { ProjectRead } from '@/types'
import { ProjectCard } from './project-card'
import { ProjectList } from './project-list'

export const loader = async ({ params }: LoaderFunctionArgs) => {
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

    return { project, recommendedProjectList }
  } catch (error) {
    console.error({ error })
    throw new Response("プロジェクトが見つかりません", { status: 404 });
  }
}

export default function ProjectDetails() {
  const { project, recommendedProjectList } = useLoaderData<typeof loader>()
  
  return (
    <div className="flex justify-between mx-8">
      <ProjectList projectList={recommendedProjectList} />
      <ProjectCard project={project} />
    </div>
  )
}
