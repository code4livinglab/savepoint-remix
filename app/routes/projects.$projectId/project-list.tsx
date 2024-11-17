import { useNavigate } from '@remix-run/react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ProjectRead } from "@/types"

export function ProjectList({ projectList }: { projectList: ProjectRead[] }) {
  const navigate = useNavigate()

  return (
    <Card className="relative flex flex-col w-96 h-[calc(100dvh-9rem)] overflow-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg">おすすめのプロジェクト</CardTitle>
      </CardHeader>
      <CardContent>
        {projectList.map((project, index) => (
          <div key={project.id}>
            <div
              className="grid gap-2 cursor-pointer hover:bg-accent rounded-md p-2 transition-colors"
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
          {index !==  projectList.length - 1 && (
            <Separator className="my-2" />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
