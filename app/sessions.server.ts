import { createCookieSessionStorage, redirect } from "@remix-run/node"
import { createThemeSessionResolver } from "remix-themes"

const domain = process.env.APP_DOMAIN
const sessionSecret = process.env.SESSION_SECRET as string
const isProduction = process.env.NODE_ENV === "production"

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24,  // 1日間
    sameSite: "lax",
    secrets: [sessionSecret],
    ...(isProduction
      ? { domain , secure: true }
      : {}),
  },
})

export const themeSessionResolver = createThemeSessionResolver(sessionStorage)
export const { getSession, commitSession, destroySession } = sessionStorage

// クライアントサイドでの認証
export async function authorizeClient(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId: string | undefined = session.get("userId");

  if (typeof userId === "undefined") {
    throw new Response("Unauthorized", { status: 401 });
  }

  return userId;
}

// サーバーサイドでの認証
export async function authorizeServer(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId: string | undefined = session.get("userId");

  if (typeof userId === "undefined") {
    throw new Response("Unauthorized", { status: 401 });
  }

  return userId;
}

