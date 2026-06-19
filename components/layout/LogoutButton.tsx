"use client";

import { toast } from "sonner";
import { RecipeButton } from "@/components/ui/RecipeButton";
import { signOutUser } from "@/lib/services/auth.service";

export function LogoutButton() {
  const handleLogout = async () => {
    toast.success("You've been signed out. See you next time!");
    await signOutUser();
  };

  return (
    <RecipeButton onClick={handleLogout}>
      Log out
    </RecipeButton>
  );
}
