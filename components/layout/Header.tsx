"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChefHat, LogOut, User } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AUTH_ROUTES, PROTECTED_NAV_ROUTES } from "@/lib/constants/constants";
import { signOutUser } from "@/lib/services/auth.service";

type HeaderProps = {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
};

function getInitials(name?: string | null) {
  if (name) {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  return "RN";
}

function NavLinks() {
  const pathname = usePathname();

  return (
    <nav
      role="tablist"
      aria-label="Main navigation"
      className="flex items-center gap-1 overflow-x-auto"
    >
      {PROTECTED_NAV_ROUTES.map(({ label, href }) => {
        const isActive =
          pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            role="tab"
            aria-selected={isActive}
            className={[
              "shrink-0 px-3 py-2 text-sm font-medium",
              isActive
                ? "rounded-full bg-primary px-5 font-bold text-white"
                : "text-primary",
            ].join(" ")}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function UserProfileSection({
  user,
}: {
  user: NonNullable<HeaderProps["user"]>;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const displayName = user.name?.trim() || "RecipeNest User";

  const handleLogout = async () => {
    await signOutUser();
  };

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 rounded-full py-1 pl-1 pr-2 outline-none transition-colors hover:bg-primary/5 data-[state=open]:bg-primary/5 focus:outline-none"
            aria-label="Open profile menu"
          >
            {user.image ? (
              <Image
                src={user.image}
                alt={displayName}
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/20"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                {getInitials(user.name)}
              </div>
            )}

            <span className="max-w-[8rem] truncate text-sm font-medium text-foreground sm:max-w-[10rem]">
              {displayName}
            </span>

            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-44"
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <DropdownMenuItem asChild>
            <Link href={AUTH_ROUTES.PROFILE}>
              <User className="h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            onSelect={() => {
              setMenuOpen(false);
              setLogoutOpen(true);
            }}
          >
            <LogOut className="h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleLogout}>
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 shadow-soft backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href={AUTH_ROUTES.HOME}
            className="flex shrink-0 items-center gap-3 transition-opacity hover:opacity-90"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <ChefHat
                className="h-5 w-5 text-primary-foreground"
                aria-hidden
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-primary">
              RecipeNest
            </span>
          </Link>

          <div className="hidden flex-1 justify-center md:flex">
            <NavLinks />
          </div>

          {user ? <UserProfileSection user={user} /> : null}
        </div>

        <div className="flex justify-center overflow-x-auto pt-2 md:hidden">
          <NavLinks />
        </div>
      </div>
    </header>
  );
}
