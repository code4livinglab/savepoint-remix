import { useEffect } from 'react'
import { Form, Link, useActionData, useNavigate } from '@remix-run/react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Project } from "@/types"
import { Download, ExternalLink, X } from "lucide-react"
import { action } from "../route"

export function ProjectCard({
  project,
  fileList,
}: {
  project: Project,
  fileList: { name: string; size: string; url: string }[],
}) {
  const actionData = useActionData<typeof action>()
  const navigate = useNavigate()

  useEffect(() => {
    const fileList = actionData?.fileList
    if (!Array.isArray(fileList)) return

    fileList.forEach((file) => {
      if (!file?.key || !file.byteArray || !file.contentType) {
        return
      }

      // Base64文字列をデコードしてバイナリデータに変換
      const binaryString = atob(file.byteArray);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: file.contentType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      
      a.href = url
      a.download = file.key.split('/').pop() ?? ''
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()
    })
  }, [actionData])
  
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
        <CardDescription className="line-clamp-[12]">
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
          {/* CardDescription が line-clamp-[12] のときに適切な高さ */}
          <div className="max-h-[176px] overflow-scroll grid gap-4">
            {fileList.map((file) => (
              <div key={file.name} className="grid gap-2">
                <Link
                  to={file.url}
                  target="_blank"
                  className="flex justify-between text-sm leading-none"
                >
                  {file.name.length > 20 ? file.name.slice(0, 20) + '...' : file.name}
                  <div className="flex gap-2">
                    <p className="shrink-0">{file.size}</p>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Form method="post" className="w-full">
            <Button type="submit" className="w-full">
              <Download />
              ロードする
            </Button>
          </Form>
        </CardFooter>
      </div>
    </Card>
  )
}
