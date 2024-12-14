import { FolderUp, Pencil } from "lucide-react"
import { useState } from "react"
import { Form } from "@remix-run/react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function ProjectSaveDialog() {
  const [fileCount, setFileCount] = useState(0);
  const [accordionItem, setAccordionItem] = useState("item-1");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ブラウザにアップロードしたファイルの数
    const count = e.target.files?.length ?? 0;
    setFileCount(count);
    
    // ファイル選択後、次のアコーディオンを開く
    if (count > 0) {
      setAccordionItem("item-2");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="relative">
          <Pencil />セーブする
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[60rem]">
        <DialogHeader>
          <DialogTitle>プロジェクトをセーブする</DialogTitle>
        </DialogHeader>
        <Accordion 
          type="single" 
          value={accordionItem} 
          onValueChange={setAccordionItem}
          defaultValue="item-1"
        >
          <Form method="post" encType="multipart/form-data">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg">ファイルをアップロードする</AccordionTrigger>
              <AccordionContent className="px-4">
                <Label htmlFor="files" className="flex flex-col items-center justify-center space-y-2 h-60 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 hover:border hover:border-solid hover:border-primary transition-colors">
                  <FolderUp className="w-12 h-12 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">クリックしてフォルダを選択する</p>
                  {fileCount > 0 && (
                    <p className="text-xs text-muted-foreground">{fileCount} 個のファイルが選択されました</p>
                  )}
                </Label>
                <Input 
                  id="files"
                  type="file"
                  // @ts-ignore
                  webkitdirectory="true"
                  directory="true"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg">フォームを入力する</AccordionTrigger>
              <AccordionContent className="px-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">プロジェクト名</Label>
                    <Input id="name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">プロジェクト概要</Label>
                    <Textarea id="description" rows={8} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reason">プロジェクトを保存する理由</Label>
                    <Textarea id="reason" rows={4} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Form>
        </Accordion>
        <DialogFooter>
          <Button type="submit">セーブする</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
