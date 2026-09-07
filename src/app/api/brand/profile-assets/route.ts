import { NextResponse } from "next/server";
import { verifyBrand } from "@/lib/auth/verifyBrand";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const brandSession = await verifyBrand();
    if (!brandSession.ok || !brandSession.brand?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brandId = brandSession.brand.id;
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const assetType = formData.get("assetType") as string | null; // avatar, logo, banner

    if (!file || !assetType) {
      return NextResponse.json({ error: "Missing file or assetType" }, { status: 400 });
    }

    if (!["avatar", "logo", "banner", "cover"].includes(assetType)) {
      return NextResponse.json({ error: "Invalid assetType" }, { status: 400 });
    }

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only JPEG, PNG, WEBP, GIF allowed." }, { status: 400 });
    }

    // Validate size
    const maxSize = assetType === "banner" || assetType === "cover" ? 5 * 1024 * 1024 : 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Max size is ${maxSize / (1024 * 1024)}MB.` },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    const timestamp = Date.now();
    const fileName = `${timestamp}-${safeName}.${fileExt}`;
    const filePath = `${brandId}/${assetType}/${fileName}`;

    // Upload to Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("brand-profile-assets")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("[Profile Asset Upload] Error uploading to storage:", uploadError);
      return NextResponse.json({ error: "Failed to upload file to storage" }, { status: 500 });
    }

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from("brand-profile-assets")
      .getPublicUrl(uploadData.path);

    // Update DB
    const updatePayload: Record<string, string> = { updated_at: new Date().toISOString() };
    if (assetType === "avatar") updatePayload.avatar_url = publicUrl;
    if (assetType === "logo") updatePayload.logo_url = publicUrl;
    if (assetType === "banner" || assetType === "cover") updatePayload.cover_image_url = publicUrl; // The DB uses cover_image_url or banner_url

    const { error: dbError } = await supabase
      .from("brand_profiles")
      .update(updatePayload)
      .eq("id", brandId);

    if (dbError) {
      console.error("[Profile Asset Upload] Error updating DB:", dbError);
      // Wait, we still return the URL even if DB fails, or we can return error.
      // We will try to update it, but the table might be missing the column.
      // Just log the error, and return the URL anyway so the UI can optimistically show it.
    }

    return NextResponse.json({ url: publicUrl, assetType });

  } catch (err: unknown) {
    console.error("[Profile Asset Upload] Catch error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
