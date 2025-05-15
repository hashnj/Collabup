'use client';
import React, { useState } from "react";
import Logo from "./Logo";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useAuth } from "@/providers/AuthProvider";

const Navbar = () => {
  const { user } = useUser() as { user: { userName: string; email?: string; _id?: string } | null }; 
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <nav className="flex justify-between items-center fixed z-50 w-full dark:bg-neutral-950 bg-neutral-100 text-white p-4 border-b border-neutral-300 dark:border-neutral-600 px-6 py-4 lg:px-10">
      <Logo />
      
      {user && (
        <Popover>
          <PopoverTrigger asChild>
          <div
            className="flex items-center justify-center  text-white w-10 h-10 cursor-pointer bg-black border-2 border-neutral-700/60 font-semibold font-mono   text-xl rounded-full hover:bg-neutral-100/20 transition-all"
            onClick={() => setIsOpen(true)}
          >
              {user.userName[0]?.toUpperCase()}
          </div>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            className="w-64 p-4 rounded-lg bg-white dark:bg-neutral-950 shadow-xl border dark:border-neutral-700"
          >
            <div className="space-y-2 text-sm text-neutral-800 dark:text-neutral-100">
              <div>
                <p className="text-muted-foreground font-thin text-xs">Name</p>
                <p className="font-medium capitalize text-xl">{user.userName}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Email</p>
                <p className="break-all text-lg text-wrap">{user.email ?? "Not provided"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">User ID</p>
                <p className="font-mono break-all ">{user._id ?? "N/A"}</p>
              </div>
            </div>

            <div className="pt-4">
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="w-full flex items-center justify-center cursor-pointer gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </nav>
  );
};

export default Navbar;
