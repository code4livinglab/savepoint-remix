import { FolderUp, Loader2, Pencil } from "lucide-react"
import { useState } from "react"
import { Form, useNavigation } from "@remix-run/react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
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
  const [accordionItem, setAccordionItem] = useState("item-1")
  const navigatoin = useNavigation()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setAccordionItem("item-2")  // ファイル選択後、次のアコーディオンを開く
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="relative" disabled={navigatoin.state === 'submitting'}>
          {navigatoin.state === 'submitting' ? (
            <>
              <Loader2 className="animate-spin" />セーブしています…
            </>
          ) : (
            <><Pencil />セーブする
              
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[60rem]">
        <DialogHeader>
          <DialogTitle>プロジェクトをセーブする</DialogTitle>
        </DialogHeader>
        <Form method="post" encType="multipart/form-data">
          <Accordion 
            type="single"
            value={accordionItem} 
            onValueChange={setAccordionItem}
            defaultValue="item-1"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg">ファイルをアップロードする</AccordionTrigger>
              <AccordionContent className="px-4">
                <Label htmlFor="file" className="flex flex-col items-center justify-center space-y-2 h-60 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 hover:border hover:border-solid hover:border-primary transition-colors">
                  <FolderUp className="w-12 h-12 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">クリックしてZIPファイルを選択する</p>
                </Label>
              </AccordionContent>
            </AccordionItem>
            {/* アコーディオンが閉じると value が失われるため下記に設置 */}
            <Input 
              id="file"
              type="file"
              name="file"
              accept=".zip"
              className="hidden"
              onChange={handleFileChange}
            />
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg">フォームを入力する</AccordionTrigger>
              <AccordionContent className="px-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">プロジェクト名</Label>
                    <Input id="name" name="name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">プロジェクト概要</Label>
                    <Textarea id="description" name="description" rows={8} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reason">プロジェクトを保存する理由</Label>
                    <Textarea id="reason" name="reason" rows={4} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="submit">セーブする</Button>
            </DialogClose>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
