"use client";

import { useState, useTransition } from "react";
import { Pencil, User } from "lucide-react";
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
import { updateProfileName } from "@/lib/user/user.actions";

type EditProfileModalProps = {
  currentName: string | null;
};

export function EditProfileModal({ currentName }: EditProfileModalProps) {
  const { update: updateSession } = useSession();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(currentName ?? "");
  const [isPending, startTransition] = useTransition();

  // Reset draft whenever the modal opens
  function handleOpenChange(next: boolean) {
    if (next) setName(currentName ?? "");
    setOpen(next);
  }

  const trimmed = name.trim();
  const isDirty = trimmed !== (currentName ?? "").trim();
  const isNameEmpty = trimmed.length === 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isDirty || isNameEmpty) return;

    startTransition(async () => {
      const result = await updateProfileName(name);

      if (!result.success) {
        toast.error(result.message ?? "Could not update name");
        return;
      }

      // Update the JWT so useSession() reflects the new name everywhere
      // (e.g. Header initials) without requiring a sign-out.
      await updateSession({ name: trimmed });

      toast.success("Profile updated");
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Edit profile name"
          title="Edit name"
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
                Update your display name
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-1.5 py-1">
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
            autoFocus
            disabled={isPending}
          />
          {isNameEmpty && name !== "" && (
            <p className="text-xs text-destructive">Name cannot be empty.</p>
          )}
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
