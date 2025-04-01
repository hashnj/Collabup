'use client';
import React from "react";
import { Users } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();
  return (
    <div className="bg-gradient-to-r from-black dark:from-white to-blue-500 bg-clip-text cursor-pointer text-transparent w-fit" onClick={() => router.push("/")}>
      <span className="flex text-2xl p-2">
        <Users className="size-8 text-blue-500" />
        <motion.div
          initial={{ width: 0  }}
          animate={{ width: "auto" }}
          transition={{ duration: 0.5 ,ease: "easeOut"}}
          className="overflow-hidden whitespace-nowrap"
        >
          Collab-up
        </motion.div>
      </span>
    </div>
  );
};

export default Logo;
