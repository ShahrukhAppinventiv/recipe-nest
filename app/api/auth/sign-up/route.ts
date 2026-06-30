import { NextResponse } from "next/server";
import { apiFetchPublic } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/types/api.types";

type RegisterResponse = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: string;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = body?.name?.trim();
    const email = body?.email?.trim();
    const password = body?.password;

    if (!name || !email || !password) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Name, email, and password are required",
        },
        { status: 400 },
      );
    }

    const user = await apiFetchPublic<RegisterResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Account created successfully",
        data: user,
      },
      { status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while creating your account";

    const status = message.toLowerCase().includes("already exists") ? 409 : 500;

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message,
        error,
      },
      { status },
    );
  }
}
