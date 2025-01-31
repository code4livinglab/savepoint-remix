import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { ProjectCard } from './components/project-card'
import { ProjectList } from './components/project-list'
import { 
  createBookmark,
  deleteBookmark,
  downloadFileList, 
  getFileList, 
  getProject, 
  getRecommendedProjectList,
  findBookmark,
} from '../queries';
import { authorize } from '@/sessions.server';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userId = await authorize(request)

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

  // ブックマーク状態の取得
  const isBookmarked = await findBookmark(userId, projectId)

  return { 
    project, 
    fileList, 
    recommendedProjectList,
    isBookmarked,
  }
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const userId = await authorize(request)

  // エラーハンドリング
  const projectId = params.projectId
  if (!projectId) {
    throw new Response("プロジェクトが見つかりません", { status: 404 });
  }

  const formData = await request.formData()
  const intent = formData.get("intent")

  if (intent === "bookmark") {
    await createBookmark(userId, projectId)
    return{ success: true }
  }

  if (intent === "unbookmark") {
    await deleteBookmark(userId, projectId)
    return{ success: true }
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
