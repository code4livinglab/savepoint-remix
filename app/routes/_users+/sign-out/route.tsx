import { ActionFunctionArgs, redirect } from "@remix-run/node"
import { authorizeClient, destroySession, getSession } from "@/sessions.server"

export const action = async ({ request }: ActionFunctionArgs) => {
  await authorizeClient(request)

  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/sign-in", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};