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
import { Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function SavedProjectList({ projectList }: { projectList: Project[] }) {
  const navigate = useNavigate()

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg">保存したプロジェクト</CardTitle>
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>プロジェクトの削除</DialogTitle>
                    <DialogDescription>
                      <p>この操作は取り消せません。</p>
                      <p>本当にプロジェクト「 <b>{project.name}</b> 」を削除しますか？</p>
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Form method="post">
                      <input type="hidden" name="projectId" value={project.id} />
                      <div className="flex gap-2 justify-end">
                        <DialogClose asChild>
                          <Button type="button" variant="outline">
                            キャンセル
                          </Button>
                        </DialogClose>
                        <Button type="submit" variant="destructive">
                          削除する
                        </Button>
                      </div>
                    </Form>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
