import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import type { ApiResponse } from "@/lib/types/api.types";

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "You must be signed in to contact us" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const subject = body?.subject?.trim();
    const message = body?.message?.trim();

    if (!subject || !message) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Subject and message are required" },
        { status: 400 },
      );
    }

    return NextResponse.json<ApiResponse>(
      { success: true, message: "Message sent successfully" },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Something went wrong", error },
      { status: 500 },
    );
  }
}
