import React from "react";
import Logo from "./Logo";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center fixed z-50 w-full dark:bg-neutral-950 bg-neutral-100 text-white p-4 border-b border-neutral-300 dark:border-neutral-600 px-6 py-4 lg:px-10">
          <Logo />
        <div>user</div>
    </nav>
  );
};

export default Navbar;
