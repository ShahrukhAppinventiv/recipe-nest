import { signIn, signOut } from "next-auth/react";
import { AUTH_ROUTES } from "@/lib/constants/constants";
import type { SocialLoginProvider } from "@/lib/constants/constants";
import type { ApiResponse } from "@/lib/types/api.types";

interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export async function signUpUser(
  payload: SignUpPayload,
): Promise<ApiResponse> {
  const response = await fetch("/api/auth/sign-up", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result: ApiResponse = await response.json();

  if (!result.success) {
    return result;
  }

  return signInWithCredentials(payload.email, payload.password);
}

export async function signInWithCredentials(
  email: string,
  password: string,
): Promise<ApiResponse> {
  const result = await signIn("credentials", {
    redirect: false,
    email,
    password,
  });

  if (result?.error) {
    return {
      success: false,
      message: result.error,
      error: result.error,
    };
  }

  return {
    success: true,
    message: "Signed in successfully",
  };
}

export async function signInWithProvider(
  provider: SocialLoginProvider,
): Promise<void> {
  await signIn(provider, { callbackUrl: AUTH_ROUTES.HOME });
}

export async function signOutUser(): Promise<void> {
  await signOut({ callbackUrl: AUTH_ROUTES.SIGN_IN });
}
