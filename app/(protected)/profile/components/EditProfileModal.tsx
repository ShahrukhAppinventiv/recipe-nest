"use client";

import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { Pencil, User, Camera, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserProfile, deletePreviousProfileImage } from "@/lib/user/user.actions";

type EditProfileModalProps = {
  currentName: string | null;
  currentImage: string | null;
};

function getInitials(name?: string | null) {
  if (name?.trim()) {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  return "RN";
}

export function EditProfileModal({ currentName, currentImage }: EditProfileModalProps) {
  const { update: updateSession } = useSession();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(currentName ?? "");
  const [isPending, startTransition] = useTransition();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage);
  const [imageAction, setImageAction] = useState<'none' | 'change' | 'remove'>('none');

  // Reset draft whenever the modal opens
  function handleOpenChange(next: boolean) {
    if (next) {
      setName(currentName ?? "");
      setSelectedFile(null);
      setPreviewUrl(currentImage);
      setImageAction('none');
    } else {
      // Clean up dynamic object URL to avoid memory leaks
      if (previewUrl && previewUrl !== currentImage) {
        URL.revokeObjectURL(previewUrl);
      }
    }
    setOpen(next);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB limit
    if (file.size > MAX_SIZE) {
      toast.error("Image file size must be less than 5MB.");
      return;
    }

    if (previewUrl && previewUrl !== currentImage) {
      URL.revokeObjectURL(previewUrl);
    }

    const localUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(localUrl);
    setImageAction('change');
  };

  const handleRemovePhoto = () => {
    if (previewUrl && previewUrl !== currentImage) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageAction('remove');
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const trimmed = name.trim();
  const isDirty = trimmed !== (currentName ?? "").trim() || imageAction !== 'none';
  const isNameEmpty = trimmed.length === 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isDirty || isNameEmpty) return;

    startTransition(async () => {
      let isSuccess = true;
      let newImageUrl: string | null | undefined = undefined;

      // 1. Upload new image if selected
      if (imageAction === "change" && selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          const uploadResult = await uploadRes.json();
          console.log("Upoad Result", uploadResult);

          if (!uploadRes.ok || !uploadResult.success) {
            toast.error(uploadResult.message ?? "Could not upload image");
            isSuccess = false;
          } else {
            newImageUrl = uploadResult.data.url;
          }
        } catch (err) {
          toast.error("An error occurred during image upload");
          console.error(err);
          isSuccess = false;
        }
      } else if (imageAction === "remove") {
        newImageUrl = null;
      }

      // 2. Call server action to update name and image on backend API
      if (isSuccess) {
        const result = await updateUserProfile(name, newImageUrl);
        if (!result.success) {
          toast.error(result.message ?? "Could not update profile");
          isSuccess = false;
        }
      }

      // 3. Update NextAuth session and close modal
      if (isSuccess) {
        await updateSession({
          name: trimmed,
          image: newImageUrl !== undefined ? newImageUrl : currentImage,
        });

        // Delete previous image from Supabase Storage if it was changed or removed
        if (imageAction !== "none" && currentImage) {
          deletePreviousProfileImage(currentImage).catch((err) => {
            console.error("Failed to delete previous image:", err);
          });
        }

        toast.success("Profile saved successfully");
        setOpen(false);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Edit profile"
          title="Edit profile"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <User className="h-4 w-4 text-primary" aria-hidden />
            </div>
            <div>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription className="mt-0.5">
                Update your display name and profile image
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          {/* Profile Image Picker */}
          <div className="flex flex-col items-center gap-3 pb-3">
            <div className="group relative flex h-24 w-24 items-center justify-center rounded-full overflow-hidden bg-primary/10 ring-4 ring-primary/15 transition-all duration-300 hover:ring-primary/30">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Profile picture preview"
                  width={96}
                  height={96}
                  unoptimized
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <span className="text-2xl font-semibold text-primary transition-transform duration-300 group-hover:scale-105">
                  {getInitials(name)}
                </span>
              )}

            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              disabled={isPending}
            />

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs gap-1.5 font-medium hover:bg-primary/5 hover:text-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending}
              >
                <Camera className="h-3.5 w-3.5" />
                Upload Photo
              </Button>
              {previewUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5 font-medium transition-colors"
                  onClick={handleRemovePhoto}
                  disabled={isPending}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-name" className="text-sm font-medium">
              Full name
            </Label>
            <Input
              id="edit-name"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              autoComplete="name"
              disabled={isPending}
            />
            {isNameEmpty && name !== "" && (
              <p className="text-xs text-destructive">Name cannot be empty.</p>
            )}
          </div>
        </form>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            type="button"
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit as unknown as React.MouseEventHandler}
            disabled={!isDirty || isNameEmpty || isPending}
          >
            {isPending ? "Saving…" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
