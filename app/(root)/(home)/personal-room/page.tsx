'use client';

import React from "react";
import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const PersonalRoom = () => {
  const { user } = useUser() as { user: { userName: string; email?: string; _id?: string } | null };
  const { logout } = useAuth();

  if (!user) return <p className="text-center mt-10">Not logged in</p>;

  return (
    <div className="flex h-screen w-full items-center justify-center">
    <div className=" w-full h-full rounded-xl  dark:border-neutral-800 text-neutral-900 dark:text-neutral-100">
      <h1 className="text-2xl font-bold mb-4">👤 Personal Room</h1>

      <div className="space-y-4 text-sm">
        <div>
          <p className="text-muted-foreground text-xs">Name</p>
          <p className="font-medium">{user.userName}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Email</p>
          <p className="break-all">{user.email ?? "Not provided"}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">User ID</p>
          <p className="font-mono text-xs break-all">{user._id ?? "N/A"}</p>
        </div>
      </div>

      <div className="pt-6">
        <Button
          variant="destructive"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
    </div>
  );
};

export default PersonalRoom;
