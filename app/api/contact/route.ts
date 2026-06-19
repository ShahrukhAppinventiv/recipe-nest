import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
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

    const supabase = createAdminClient();

    const { error } = await supabase.from("contact").insert({
      user_id: Number(session.user.id),
      subject,
      message,
    });

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Failed to send message", error },
        { status: 500 },
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
