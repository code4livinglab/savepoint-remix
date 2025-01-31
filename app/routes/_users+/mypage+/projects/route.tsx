import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData, useNavigate } from "@remix-run/react"
import { AppBar } from "@/components/app-bar"
import { Button } from "@/components/ui/button"
import { authorize } from "@/sessions.server"
import { deleteProjectUser, findProjectListByUser } from "../../../projects+/queries"
import { SavedProjectList } from "@/routes/_users+/mypage+/projects/components/saved-project-list"

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await authorize(request)

  const projects = await findProjectListByUser(userId)
  return { projects }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await authorize(request);
  const formData = await request.formData();
  const projectId = formData.get("projectId") as string;

  if (!projectId) {
    throw new Response("プロジェクトIDが必要です", { status: 400 });
  }

  await deleteProjectUser(userId, projectId);
  return null;
};

export default function SavedProjects() {
  const { projects } = useLoaderData<typeof loader>()
  const navigate = useNavigate()

  return (
    <div className="relative h-dvh">
      <AppBar />
      <div className="container mx-auto py-8 space-y-8">
        <SavedProjectList projectList={projects} />
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate('/projects')}
          >
            戻る
          </Button>
        </div>
      </div>
    </div>
  )
}
