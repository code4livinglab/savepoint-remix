import { compare } from "bcrypt";
import { z } from "zod";
import { User } from "@prisma/client";
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node"
import { Link } from "@remix-run/react";
import { Button } from "@/components/ui/button"
import { prisma } from "@/prisma"
import { getSession, commitSession } from "@/sessions.server";
import { SignInForm } from "./sign-in-form"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
}).refine(async ({ email, password }) => {
  const user = await prisma.user.findFirst({ where: { email }})

  // ユーザーが存在しない場合
  if (user === null) {
    return false
  }

  // パスワードが一致しない場合
  const isMatch = await compare(password, user.password);
  if (!isMatch) {
    return false
  }

  return true
}, {
  message: 'Email or password is incorrect',
  path: ['password'],
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // セッションの取得
  const session = await getSession(request.headers.get("Cookie"));

  // ログイン済みの場合はホームページに遷移
  if (session.has("userId")) {
    return redirect("/projects");
  }

  return null
}

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    // フォームデータの取得
    const formData = await request.formData();
    const object = Object.fromEntries(formData);
    const result = await schema.safeParseAsync(object);

    // バリデーション
    if (!result.success) {
      const error = result.error.flatten().fieldErrors;
      console.log({ error });
      return error
    }

    // ユーザー取得
    // TODO: バリデーションと処理が重複しているため、リファクタリングする
    const { email, password } = result.data;
    const user = await prisma.user.findFirst({ where: { email }}) as User;

    // セッションの作成
    const session = await getSession(request.headers.get("Cookie"));
    session.set("userId", user.id);

    // ホームページに遷移
    return redirect("/projects", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error: any) {
    // const message = error.message || "予期せぬエラーが発生しました。";
    console.log({ error });
    // { error: { message } }
  }
}

export default function SignIn() {
  return (
    <>
      <div className="md:hidden">
        <img
          // src="/examples/authentication-light.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="block dark:hidden"
        />
        <img
          // src="/examples/authentication-dark.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="hidden dark:block"
        />
      </div>
      <div className="container relative hidden h-dvh flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Button 
          variant="ghost"
          className="absolute right-4 top-4 md:right-8 md:top-8"
        >
          <Link to="/sign-up">ユーザー登録</Link>
        </Button>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <img src="/savepoint-light.svg" className="h-8" />
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-4">
              <p>
                正直、プロジェクトの多くは、<strong>挫折</strong>する。
                でもそれは、悪いことばかりではない。
                挫折したプロジェクトにこそ、引き継いでゆける想いや知見があるはず。
                だからこそ、ちゃんと<strong>&ldquo;セーブ&rdquo;</strong>しよう。
                葬ってしまうのではなく、<strong>未来</strong>に残そう。
                それはきっと、いつかの自分の、どこかの誰かの、社会にとっての、一歩になる。
                さあ、あなたのうまくいかなかったプロジェクトを教えてください。
                セーブポイントが、<strong>未来</strong>へと<strong>紡</strong>いでゆきます。
              </p>
              <footer className="text-sm">
                savepoint：プロジェクトを未来へ引き継ぐプラットフォーム
              </footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <SignInForm />
        </div>
      </div>
    </>
  )
}
