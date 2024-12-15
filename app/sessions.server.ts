import { createCookieSessionStorage, redirect } from "@remix-run/node"
import { createThemeSessionResolver } from "remix-themes"

// You can default to 'development' if process.env.NODE_ENV is not set
const isProduction = process.env.NODE_ENV === "production"

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24,  // 1日間
    sameSite: "lax",
    secrets: ["s3cr3t"],
    // Set domain and secure only if in production
    ...(isProduction
      ? { domain: "your-production-domain.com", secure: true }
      : {}),
  },
})

export const themeSessionResolver = createThemeSessionResolver(sessionStorage)
export const { getSession, commitSession, destroySession } = sessionStorage

export async function authorize(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId: string | undefined = session.get("userId");

  if (typeof userId === "undefined") {
    throw redirect("/sign-in");
  }

  return userId;
}
