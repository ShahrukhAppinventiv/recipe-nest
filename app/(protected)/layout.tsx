import { getAuthSession } from "@/lib/auth";
import { Header } from "@/components/layout/Header";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  return (
    <div className="min-h-screen bg-background">
      <Header user={session?.user} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
