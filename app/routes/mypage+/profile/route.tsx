import { LoaderFunctionArgs } from "@remix-run/node"
import { authorizeClient } from "@/sessions.server"
import { getUser } from "./queries"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await authorizeClient(request)
  
  const user = await getUser(userId)
  return { user }
}
