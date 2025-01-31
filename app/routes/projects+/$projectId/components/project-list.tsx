import { useState } from 'react'
import { useNavigate } from '@remix-run/react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ProjectRead } from "@/types"

export function ProjectList({ projectList }: { projectList: ProjectRead[] }) {
  const [isMinimized, setIsMinimized] = useState(false)
  const navigate = useNavigate()

  return (
    <>
      {!isMinimized ? (
        <Card className="relative flex flex-col w-96 overflow-auto">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2"
            onClick={() => setIsMinimized(true)}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <CardHeader className="space-y-1">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">おすすめのプロジェクト</CardTitle>
            </div>
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
      ) : (
        <Button 
          size="icon"
          variant="outline"
          className="relative"
          onClick={() => setIsMinimized(false)}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      )}
    </>
  )
}
