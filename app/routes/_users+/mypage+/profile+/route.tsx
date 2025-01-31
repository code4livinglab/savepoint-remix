import { useState } from "react";
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { authorize, commitSession, destroySession, getSession } from "@/sessions.server";
import { deleteUser, findUserByEmail, findUserById, updateUser } from "../../queries";
import { schema } from "./schema";
import { Loader2 } from "lucide-react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await authorize(request);
  const user = await findUserById(userId);
  
  if (!user) {
    throw new Response("ユーザーが見つかりません", { status: 404 });
  }
  
  return { user };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await authorize(request);
  const currentUser = await findUserById(userId)
  
  if (!currentUser) {
    throw new Response("ユーザーが見つかりません", { status: 404 });
  }

  const formData = await request.formData();
  const object = Object.fromEntries(formData);

  // ユーザー削除
  if (object.intent === "delete") {
    deleteUser(userId);
    const session = await getSession(request.headers.get("Cookie"));
    return redirect("/sign-up", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }

  // バリデーション
  const result = await schema.safeParseAsync(object);
  const error = result.error?.flatten().fieldErrors ?? {};

  // TODO: schema で実施する
  const idUser = await findUserById(object.id as string)
  if (idUser !== null && idUser.id !== userId) {
    if (error.id === undefined) {
     error.id = ['Already used']
    } else {
      error.id.push('Already used')
    }
  }

  // TODO: schema で実施する
  const emailUser = await findUserByEmail(object.email as string)
  if (emailUser !== null && emailUser.email !== currentUser.email) {
    if (error.email === undefined) {
     error.email = ['Already used']
    } else {
      error.email.push('Already used')
    }
  }

  if (!!error.id || !!error.name || !!error.email) {
    console.log({ error });
    return error
  }

  if (!result.success){
    return error
  }

  // ユーザー編集
  const data = result.data;
  const password = currentUser.password;
  const user = await updateUser(userId, { ...data, password})

  // 既存セッションの削除
  const session = await getSession(request.headers.get("Cookie"));
  await destroySession(session)

  // 新規セッションの作成
  const cookie = request.headers.get("Cookie");
  const newSession = await getSession(cookie);
  newSession.set("userId", user.id);

  // リロードによるセッションの更新
  return redirect("/mypage/profile", {
    headers: { "Set-Cookie": await commitSession(newSession) },
  });
};

export default function Profile() {
  const { user } = useLoaderData<typeof loader>();
  const error = useActionData<typeof action>();

  const [userId, setUserId] = useState("");
  const navigatoin = useNavigation();

  return (
    <div className="container h-dvh mx-auto py-8 space-y-8">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl mb-4">プロフィール編集</CardTitle>
        </CardHeader>
        <CardContent>
          <Form method="post" className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="id">ユーザーID</Label>
              <Input
                id="id"
                name="id"
                defaultValue={user.id}
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
              <Label htmlFor="name">ユーザ名</Label>
              <Input
                id="name"
                name="name"
                defaultValue={user.name}
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
                defaultValue={user.email}
                className={error?.email ? "border-destructive" : ""}
              />
              {error?.email && (
                <p className="text-xs text-destructive">
                  {error.email[0]}
                </p>
              )}
            </div>
            <CardFooter className="mt-4 flex justify-end">
              <Button type="submit" disabled={navigatoin.state === 'submitting'}>
              {navigatoin.state === 'submitting' ? (
                <>
                  <Loader2 className="animate-spin" />保存しています…
                </>
              ) : (
                <>保存する</>
              )}
              </Button>
            </CardFooter>
          </Form>
        </CardContent>
      </Card>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive" className="mt-4">
            アカウント削除
          </Button>
        </DialogTrigger>
        <DialogContent className="grid gap-4">
          <DialogHeader className="grid gap-2">
            <DialogTitle>アカウントの削除</DialogTitle>
            <DialogDescription>
              <p>この操作は取り消せません。本当にアカウントを削除しますか？</p>
              <p>確認のため、ユーザーID（ <b>{user.id}</b> ）を入力してください。</p>
            </DialogDescription>
          </DialogHeader>
          <Form method="post" className="grid gap-4">
            <input type="hidden" name="intent" value="delete" />
            <div className="space-y-2">
              <Label htmlFor="id">ユーザーID</Label>
              <Input
                id="id"
                name="id"
                onChange={(e) => setUserId(e.target.value)}
                placeholder={user.id}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  戻る
                </Button>
              </DialogClose>
              <Button
                type="submit"
                variant="destructive"
                disabled={userId !== user.id}
              >
                削除する
              </Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
