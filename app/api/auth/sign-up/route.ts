import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ApiResponse } from "@/lib/types/api.types";

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

    const supabase = createAdminClient();

    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "An account with this email already exists",
        },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const { data, error } = await supabase
      .from("users")
      .insert({
        name,
        email,
        password: hashedPassword,
        provider: "credentials",
        role: "USER",
      })
      .select("id, email, name, role")
      .single();

    if (error || !data) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Failed to create account",
          error,
        },
        { status: 500 },
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Account created successfully",
        data,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Something went wrong while creating your account",
        error,
      },
      { status: 500 },
    );
  }
}
