import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node"
import { useLoaderData, useNavigate } from "@remix-run/react"
import { AppBar } from "@/components/app-bar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { authorize } from "@/sessions.server"
import { 
  deleteBookmark,
  deleteProjectUser, 
  findProjectListByBookmark, 
  findProjectListByUser 
} from "../../../projects+/queries"
import { SavedProjectList } from "@/routes/_users+/mypage+/projects/components/saved-project-list"
import { BookmarkedProjectList } from "@/routes/_users+/mypage+/projects/components/bookmarked-project-list"

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await authorize(request)

  const [savedProjects, bookmarkedProjects] = await Promise.all([
    findProjectListByUser(userId),
    findProjectListByBookmark(userId),
  ])

  return { 
    savedProjects,
    bookmarkedProjects,
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await authorize(request);
  const formData = await request.formData();
  const projectId = formData.get("projectId") as string;
  const intent = formData.get("intent");

  if (!projectId) {
    throw new Response("プロジェクトIDが必要です", { status: 400 });
  }

  if (intent === "unbookmark") {
    await deleteBookmark(userId, projectId);
    return { success: true };
  }

  await deleteProjectUser(userId, projectId);
  return { success: true };
};

export default function SavedProjects() {
  const { savedProjects, bookmarkedProjects } = useLoaderData<typeof loader>()
  const navigate = useNavigate()

  return (
    <div className="relative h-dvh">
      <AppBar />
      <div className="container mx-auto py-8 space-y-8">
        <Tabs defaultValue="saved" className="space-y-6">
          <TabsList>
            <TabsTrigger value="saved">セーブリスト</TabsTrigger>
            <TabsTrigger value="bookmarked">ブックマークリスト</TabsTrigger>
          </TabsList>
          <TabsContent value="saved">
            <SavedProjectList projectList={savedProjects} />
          </TabsContent>
          <TabsContent value="bookmarked">
            <BookmarkedProjectList projectList={bookmarkedProjects} />
          </TabsContent>
        </Tabs>
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
