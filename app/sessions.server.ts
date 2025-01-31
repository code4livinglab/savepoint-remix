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

// 認証
export async function authorize(request: Request) {
  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);
  const userId: string | undefined = session.get("userId");

  if (typeof userId === "undefined") {
    throw redirect("/sign-in", {
      headers: {
        "Set-Cookie": await destroySession(session)
      }
    });
  }

  return userId;
}
