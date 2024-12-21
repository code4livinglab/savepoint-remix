import { UserRound } from "lucide-react"
import { useEffect } from "react"
import { Link, useFetcher } from "@remix-run/react"
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { loader } from "@/routes/mypage+/profile/route"

export function UserNav() {
  // 別ルートのデータを利用
  const getUserFetcher = useFetcher<typeof loader>()
  const signOutFetcher = useFetcher()

  // ユーザー情報を取得
  useEffect(() => {
    getUserFetcher.load('/mypage/profile')
  }, [getUserFetcher])

  const user = getUserFetcher.data?.user

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              <UserRound />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.name ?? "ユーザー名"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email ?? "email@example.com"}
            </p>
            
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link to="/mypage/projects">
            <DropdownMenuItem>マイページ</DropdownMenuItem>
          </Link>
          <Link to="/mypage/profile">
            <DropdownMenuItem>アカウント情報</DropdownMenuItem>
          </Link>
          <Link
            to="https://ludicrous-flyingfish-cc4.notion.site/terms-of-use"
            target="_blank"
          >
            <DropdownMenuItem>利用規約</DropdownMenuItem>
          </Link>
          <Link
            to="https://ludicrous-flyingfish-cc4.notion.site/privacy-policy"
            target="_blank"
          >
            <DropdownMenuItem>プライバシーポリシー</DropdownMenuItem>
          </Link>
          <Link
            to="https://forms.gle/uUKaFR56QQSgaNPz7"
            target="_blank"
          >
            <DropdownMenuItem>お問い合わせ</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <signOutFetcher.Form action="/sign-out" method="post">
          <DropdownMenuItem>
            <button type="submit" className="w-full text-left">ログアウト</button>
          </DropdownMenuItem>
        </signOutFetcher.Form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
