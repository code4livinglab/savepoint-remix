import { useNavigate } from '@remix-run/react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Project } from "@/types"
import { Form } from '@remix-run/react'
import { Button } from '@/components/ui/button'
import { BookmarkCheck } from 'lucide-react'

export function BookmarkedProjectList({ projectList }: { projectList: Project[] }) {
  const navigate = useNavigate()

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg">ブックマークしたプロジェクト</CardTitle>
      </CardHeader>
      <CardContent>
        {projectList.map((project, index) => (
          <div key={project.id}>
            <div className="flex items-start gap-2 hover:bg-accent rounded-md p-2 transition-colors">
              <div
                className="flex-1 grid gap-2 cursor-pointer"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <p className="text-base font-semibold">{project.name}</p>
                <p className="text-xs text-muted-foreground line-clamp-3">{project.description}</p>
                <p className="text-xs text-muted-foreground text-right">
                  更新日：
                  {new Date(project.updated).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <Form method="post">
                <input type="hidden" name="intent" value="unbookmark" />
                <input type="hidden" name="projectId" value={project.id} />
                <Button
                  type="submit"
                  variant="outline"
                  size="icon"
                  className="text-primary hover:text-primary hover:bg-primary/10"
                >
                  <BookmarkCheck className="h-4 w-4" />
                </Button>
              </Form>
            </div>
            {index !== projectList.length - 1 && (
              <Separator className="my-2" />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
