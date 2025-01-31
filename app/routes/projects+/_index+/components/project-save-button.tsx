import { FolderUp, Loader2, Pencil } from "lucide-react"
import { useEffect, useState } from "react"
import { Form, useActionData, useNavigation } from "@remix-run/react"
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
import { action } from "../route"

export function ProjectSaveDialog() {
  const error = useActionData<typeof action>();

  const [accordionItem, setAccordionItem] = useState("item-1")
  const [open, setOpen] = useState(false)
  const navigatoin = useNavigation()
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setAccordionItem("item-2")  // ファイル選択後、次のアコーディオンを開く
  };

  // フォーム送信後、ダイアログを閉じる
  useEffect(() => {
    if (navigatoin.state !== 'submitting') {
      setOpen(false)
    }
  }, [navigatoin.state])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="relative">
          <Pencil />セーブする
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
                  {error?.file && (
                    <p className="text-xs text-destructive">
                      {error.file[0]}
                    </p>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="name">プロジェクト名</Label>
                    <Input
                      id="name"
                      name="name"
                      className={error?.name ? "border-destructive" : ""}
                    />
                    {error?.name && (
                      <p className="text-xs text-destructive">
                        {error.name[0]}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">プロジェクト概要</Label>
                    <Textarea
                      id="description"
                      name="description"
                      rows={8}
                      className={error?.description ? "border-destructive" : ""}
                    />
                    {error?.description && (
                      <p className="text-xs text-destructive">
                        {error.description[0]}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reason">プロジェクトを保存する理由</Label>
                    <Textarea
                      id="reason"
                      name="reason"
                      rows={4}
                      className={error?.reason ? "border-destructive" : ""}
                    />
                    {error?.reason && (
                      <p className="text-xs text-destructive">
                        {error.reason[0]}
                      </p>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <DialogFooter className="mt-4">
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button type="button" onClick={() => {/* Add your close logic here */}} variant="outline">
                  閉じる
                </Button>
              </DialogClose>
              {accordionItem === "item-2" && (
                <Button type="submit" disabled={navigatoin.state === 'submitting'}>
                  {navigatoin.state === 'submitting' ? (
                    <>
                      <Loader2 className="animate-spin" />セーブしています…
                    </>
                  ) : (
                    <>セーブする</>
                  )}
                </Button>
              )}
            </div>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
