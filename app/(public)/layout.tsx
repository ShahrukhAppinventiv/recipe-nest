import Image from "next/image";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <Image
        src="/recipe6.avif"
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      <div
        className="absolute inset-0 bg-linear-to-br from-primary-dark/85 via-primary-dark/60 to-foreground/80"
        aria-hidden
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-8">
        <header className="text-center">
          <p className="font-heading text-4xl text-primary-foreground tracking-tight">
            RecipeNest
          </p>
          <p className="mt-2 text-sm text-primary-foreground/80">
            Curated Recipes for Every Kitchen
          </p>
        </header>

        <div className="w-full rounded-2xl border border-border/20 bg-card/95 p-8 shadow-premium backdrop-blur-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
