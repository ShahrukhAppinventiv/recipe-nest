import { redirect } from "next/navigation";
import { AUTH_ROUTES } from "@/lib/constants/constants";

// Redirect to home — middleware handles unauthenticated users and
// sends them to /sign-in before this page is reached.
export default function RootPage() {
  redirect(AUTH_ROUTES.HOME);
}
