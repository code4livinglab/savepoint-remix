import { ActionFunctionArgs } from "@remix-run/node"
import { destroySession, getSession } from "@/sessions.server"
import { redirect } from "@remix-run/node"

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/sign-in", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};
