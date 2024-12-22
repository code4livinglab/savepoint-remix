import { randomUUID } from 'crypto'
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node"
import { Outlet, useLoaderData } from "@remix-run/react"
import { AppBar } from "@/components/app-bar"
import { ProjectRole } from '@/types'
import { authorize } from '@/sessions.server'
import { Explore } from "./components/explore"
import { schema } from "./schema"
import { reduceProjectDimension } from "./utils"
import {
  createProject,
  createProjectUser,
  getEmbedding,
  getProjectList,
  uploadFiles
} from "../queries"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authorize(request);

  // プロジェクト一覧を取得
  const rawProjectList = await getProjectList();
  const projectList = reduceProjectDimension(rawProjectList)  // 次元削減
  return { projectList }
}

export async function action({ request }: ActionFunctionArgs) {
  const userId = await authorize(request);

  // フォームデータの取得
  const formData = await request.formData();
  const object = Object.fromEntries(formData);

  // バリデーション
  const result = await schema.safeParseAsync(object);
  if (!result.success) {
    const error = result.error.flatten().fieldErrors;
    console.log({ error });
    return error
  }

  // データの追加作成
  const id = randomUUID();
  const { name, reason, files, ...data } = result.data;
  const description = `## プロジェクト概要

${data.description}

## プロジェクトをセーブした理由

${reason}
`;

  // プロジェクトの作成
  const embedding = await getEmbedding(description)
  await createProject({ id, name, description, embedding })
  await createProjectUser({ userId, projectId: id, role: ProjectRole.OWNER })
  await uploadFiles(id, files)

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
