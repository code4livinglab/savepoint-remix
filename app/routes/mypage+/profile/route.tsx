import { LoaderFunctionArgs } from "@remix-run/node"
import { authorize } from "@/sessions.server"
import { getUser } from "./queries"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await authorize(request)
  
  const user = await getUser(userId)
  return { user }
}
