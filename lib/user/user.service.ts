import type { UserProfile } from "@/lib/user/user.types";
import { createAdminClient } from "@/lib/supabase/admin";

type DbUserProfile = {
  id: number;
  name: string | null;
  email: string;
  image: string | null;
  role: string | null;
  provider: string | null;
  created_at: string | null;
  last_login_at: string | null;
};

function toUserProfile(row: DbUserProfile): UserProfile {
  return {
    id: String(row.id),
    name: row.name,
    email: row.email,
    image: row.image,
    role: row.role ?? "USER",
    provider: row.provider,
    createdAt: row.created_at,
    lastLoginAt: row.last_login_at,
  };
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const id = Number(userId);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, image, role, provider, created_at, last_login_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return toUserProfile(data as DbUserProfile);
}
