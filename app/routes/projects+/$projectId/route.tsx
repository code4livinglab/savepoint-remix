import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { ProjectCard } from './components/project-card'
import { ProjectList } from './components/project-list'
import { downloadFileList, getFileList, getProject, getRecommendedProjectList } from '../queries';
import { authorize } from '@/sessions.server';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await authorize(request)

  // エラーハンドリング
  const projectId = params.projectId
  if (!projectId) {
    throw new Response("プロジェクトが見つかりません", { status: 404 });
  }

  // プロジェクトの取得
  const project = await getProject(projectId)
  const fileList = await getFileList(projectId)

  // 類似プロジェクトの取得
  const recommendedProjectList = await getRecommendedProjectList(project)

  return { project, fileList, recommendedProjectList }
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  await authorize(request)

  // エラーハンドリング
  const projectId = params.projectId
  if (!projectId) {
    throw new Response("プロジェクトが見つかりません", { status: 404 });
  }

  // ロード
  const fileList = await downloadFileList(projectId)

  return { fileList }
}

export default function ProjectDetails() {
  const { project, recommendedProjectList, fileList } = useLoaderData<typeof loader>()
  
  return (
    <div className="flex justify-between mx-8 h-[calc(100dvh-9rem)]">
      <ProjectList projectList={recommendedProjectList} />
      <ProjectCard project={project} fileList={fileList} />
    </div>
  )
}
