"use client";

import { RecipeButton } from "@/components/ui/RecipeButton";
import { signOutUser } from "@/lib/services/auth.service";

export function LogoutButton() {
  const handleLogout = async () => {
    await signOutUser();
  };

  return (
    <RecipeButton onClick={handleLogout}>
      Log out
    </RecipeButton>
  );
}
