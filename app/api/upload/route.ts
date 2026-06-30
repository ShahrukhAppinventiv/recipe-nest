import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/client";

export async function POST(request: Request) {
  try {
    // 1. Validate session
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please log in." },
        { status: 401 }
      );
    }

    // 2. Parse form data and validate image
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    // Validate mime-type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Validate size (5MB limit)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: "Image size must be less than 5MB" },
        { status: 400 }
      );
    }

    // 3. Rename file
    const extension = file.name.split(".").pop() || "png";
    const fileName = `user_${session.user.id}_${Date.now()}.${extension}`;

    const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "recipes";

    // Ensure the bucket exists
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const bucketExists = buckets?.some((b) => b.name === bucketName);
    if (!bucketExists) {
      const { error: createBucketError } = await supabaseAdmin.storage.createBucket(
        bucketName,
        {
          public: true,
        }
      );
      if (createBucketError) {
        console.error(`Error creating '${bucketName}' bucket:`, createBucketError);
        return NextResponse.json(
          { success: false, message: "Failed to configure storage bucket" },
          { status: 500 }
        );
      }
    }

    // Convert file to array buffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Upload file to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { success: false, message: uploadError.message },
        { status: 500 }
      );
    }

    // 5. Get Public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    if (!urlData?.publicUrl) {
      return NextResponse.json(
        { success: false, message: "Failed to retrieve public URL of uploaded file" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url: urlData.publicUrl,
      },
    });
  } catch (error) {
    console.error("Upload handler error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Internal server error during upload",
      },
      { status: 500 }
    );
  }
}
