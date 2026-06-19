import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { AUTH_ROUTES } from "@/lib/constants/constants";

export default async function RootPage() {
  const session = await getAuthSession();
  redirect(session ? AUTH_ROUTES.HOME : AUTH_ROUTES.SIGN_IN);
}
