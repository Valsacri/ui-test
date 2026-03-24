import { redirect } from "next/navigation"
import { APP_HOME_PATH } from "@/lib/constants"

/** `/` is rewritten to landing when logged out or redirected to `/home` when logged in; this is a fallback. */
export default function RootRoute() {
    redirect(APP_HOME_PATH)
}
