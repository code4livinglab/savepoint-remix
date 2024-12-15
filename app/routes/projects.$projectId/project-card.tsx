import { Form, Link, useNavigate } from '@remix-run/react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ProjectRead } from "@/types"
import { Download, X } from "lucide-react"

export function ProjectCard({
  project,
  fileList,
}: {
  project: ProjectRead,
  fileList: { name: string; size: string; url: string }[],
}) {
  const navigate = useNavigate()
  
  return (
    <Card className="relative flex flex-col justify-between w-96 h-[calc(100dvh-9)]">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute right-2 top-2"
        onClick={() => { navigate('/projects') }}
      >
        <X className="h-4 w-4" />
      </Button>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl mb-4">{project.name}</CardTitle>
        <CardDescription className="line-clamp-[16]">
          {project.description}
        </CardDescription>
      </CardHeader>
      <div>
        <CardContent className="grid gap-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                プロジェクトデータ
              </span>
            </div>
          </div>
          {fileList.map((file) => (
            <div key={file.name} className="grid gap-2">
              <Link
                to={file.url}
                target="_blank"
                className="flex justify-between text-sm leading-none"
              >
                <div>
                  {file.name}
                  <Badge variant="secondary" className="mx-2">プレビュー</Badge>
                </div>
                <p className="shrink-0">{file.size}</p>
              </Link>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Form className="w-full">
            <Button className="w-full">
              <Download />
              ロードする
            </Button>
          </Form>
        </CardFooter>
      </div>
    </Card>
  )
}
