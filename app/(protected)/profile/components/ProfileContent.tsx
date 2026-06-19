import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";
import {
  Calendar,
  ChefHat,
  Home,
  Mail,
  Shield,
  Sparkles,
  User,
} from "lucide-react";
import { LogoutButton } from "@/components/layout/LogoutButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AUTH_ROUTES } from "@/lib/constants/constants";
import type { UserProfile } from "@/lib/user/user.types";

type ProfileContentProps = {
  user: UserProfile;
};

function getInitials(name?: string | null) {
  if (name?.trim()) {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  return "RN";
}

function formatRole(role: string) {
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

function formatProvider(provider: string | null) {
  switch (provider) {
    case "google":
      return "Google";
    case "github":
      return "GitHub";
    case "credentials":
      return "Email & password";
    default:
      return provider ?? "Unknown";
  }
}

function formatDate(isoDate: string | null) {
  if (!isoDate) {
    return "Not available";
  }

  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

type DetailRowProps = {
  icon: ReactElement;
  label: string;
  value: string;
};

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 break-words text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
}

export function ProfileContent({ user }: ProfileContentProps) {
  const displayName = user.name?.trim() || "RecipeNest User";

  return (
    <div className="flex flex-col gap-8">
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-6 shadow-soft sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(107,143,113,0.08),transparent_45%)]" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          {user.image ? (
            <Image
              src={user.image}
              alt={displayName}
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover ring-4 ring-primary/15"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary ring-4 ring-primary/15">
              {getInitials(user.name)}
            </div>
          )}

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Your account
            </div>

            <div>
              <h1 className="font-heading text-3xl text-foreground sm:text-4xl">
                {displayName}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
            </div>

            <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              {formatRole(user.role)}
            </span>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Account information</CardTitle>
            <CardDescription>
              Details linked to your RecipeNest profile
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <DetailRow
              icon={<User className="h-4 w-4" aria-hidden />}
              label="Full name"
              value={user.name?.trim() || "Not set"}
            />

            <Separator />

            <DetailRow
              icon={<Mail className="h-4 w-4" aria-hidden />}
              label="Email address"
              value={user.email}
            />

            <Separator />

            <DetailRow
              icon={<Shield className="h-4 w-4" aria-hidden />}
              label="Account role"
              value={formatRole(user.role)}
            />

            <Separator />

            <DetailRow
              icon={<ChefHat className="h-4 w-4" aria-hidden />}
              label="Sign-in method"
              value={formatProvider(user.provider)}
            />

            <Separator />

            <DetailRow
              icon={<Calendar className="h-4 w-4" aria-hidden />}
              label="Member since"
              value={formatDate(user.createdAt)}
            />

            <Separator />
{/* 
            <DetailRow
              icon={<Calendar className="h-4 w-4" aria-hidden />}
              label="Last login"
              value={formatDate(user.lastLoginAt)}
            /> */}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">Quick links</CardTitle>
              <CardDescription>
                Jump back into discovering recipes
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
              <Button asChild variant="outline" className="justify-start">
                <Link href="/recipe">
                  <ChefHat aria-hidden />
                  Browse recipes
                </Link>
              </Button>

              <Button asChild variant="outline" className="justify-start">
                <Link href={AUTH_ROUTES.HOME}>
                  <Home aria-hidden />
                  Go to home
                </Link>
              </Button>
            </CardContent>
          </Card>
{/* 
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">Session</CardTitle>
              <CardDescription>
                Sign out when you&apos;re done cooking for the day
              </CardDescription>
            </CardHeader>

            <CardContent>
              <LogoutButton />
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
}
