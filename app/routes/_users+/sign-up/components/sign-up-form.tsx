import { Form, Link, useActionData } from "@remix-run/react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { action } from "../route"

export function SignUpForm() {
  const error = useActionData<typeof action>();

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[360px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          新規登録
        </h1>
        <p className="text-sm text-muted-foreground">
          フォームを入力してアカウントを作成する
        </p>
      </div>
      <Form method="post">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="id">ユーザーID</Label>
            <Input 
              id="id" 
              name="id" 
              type="text"
              className={error?.id ? "border-destructive" : ""} 
            />
            <p className="text-xs text-muted-foreground">小文字の半角英数字のみ</p>
            {error?.id && (
              <p className="text-xs text-destructive">
                {error.id[0]}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">ユーザー名</Label>
            <Input 
              id="name" 
              name="name" 
              type="text"
              className={error?.name ? "border-destructive" : ""} 
            />
            {error?.name && (
              <p className="text-xs text-destructive">
                {error.name[0]}
              </p>
            )}
          </div>
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
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">パスワード（確認用）</Label>
            <Input 
              id="confirmPassword" 
              name="confirmPassword" 
              type="password"
              className={error?.confirmPassword ? "border-destructive" : ""} 
            />
            {error?.confirmPassword && (
              <p className="text-xs text-destructive">
                {error.confirmPassword[0]}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex space-x-2">
              <Checkbox
                id="termsAndPolicies"
                name="termsAndPolicies"
                className={`
                  self-center
                  ${error?.termsAndPolicies ? "border-destructive" : "border-muted-foreground"}
                  data-[state=checked]:border-primary
                `}
              />
              <Label
                htmlFor="termsAndPolicies"
                className="text-sm text-muted-foreground"
              >
                <Link
                  to="https://ludicrous-flyingfish-cc4.notion.site/terms-of-use"
                  target="_blank"
                  className="underline hover:text-foreground"
                >
                  利用規約
                </Link>
                &thinsp;と&thinsp;
                <Link
                  to="https://ludicrous-flyingfish-cc4.notion.site/privacy-policy"
                  target="_blank"
                  className="underline hover:text-foreground"
                >
                  プライバシーポリシー
                </Link>
                &thinsp;に同意する。
              </Label>
            </div>
            {error?.termsAndPolicies && (
              <p className="text-sm text-destructive">
                {error.termsAndPolicies[0]}
              </p>
            )}
          </div>
          <Button type="submit">登録する</Button>
        </div>
      </Form>
    </div>
  )
}
