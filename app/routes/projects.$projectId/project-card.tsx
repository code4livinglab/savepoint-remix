import { useNavigate } from '@remix-run/react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ProjectRead } from "@/types"
import { Download, X } from "lucide-react"

export function ProjectCard({ project }: { project: ProjectRead }) {
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
          <div className="grid gap-2">
            <Label htmlFor="email">サンプル1</Label>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">サンプル2</Label>
          </div>
          {/* {project.file_names && project.file_names?.length > 0 && (
            <>
              <h2 className="text-xl text-gray-200 font-semibold my-3">Data</h2>
              {project.file_names.map((filename, i) => (
                <button key={i}
                  className="text-left text-gray-300 my-1 hover:text-blue-300 hover:underline"
                  onClick={()=> viewProjectFile(project.id, filename)}
                >
                  ・{filename}
                </button>
              ))}
            </>
          )} */}
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            <Download />
            ロードする
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}

const viewProjectFile = async (projectId: string, fileName: string) => {
  try {
    const response = await fetch(`/api/${projectId}/files/${fileName}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const href = data.url;

    const a = document.createElement("a");
    a.href = href;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (err) {
    console.error("viewfile error:", err);
  }
};
