import { Form, useActionData } from "@remix-run/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { action } from "./route"

export function SignInForm() {
  const error = useActionData<typeof action>();

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[360px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          ログイン
        </h1>
        <p className="text-sm text-muted-foreground">
          以下のフォームを入力してログインする
        </p>
      </div>
      <Form method="post">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input 
              id="email" 
              name="email" 
              type="email"
              className={error?.email ? "border-destructive" : ""} 
            />
            {error?.email && (
              <p className="text-xs text-destructive">
                {error.email[0]}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">パスワード</Label>
            <Input 
              id="password" 
              name="password" 
              type="password"
              className={error?.password ? "border-destructive" : ""} 
            />
            {error?.password && (
              <p className="text-xs text-destructive">
                {error.password[0]}
              </p>
            )}
          </div>
          <Button type="submit">ログインする</Button>
        </div>
      </Form>
    </div>
  )
}
