
import { Metadata } from "next";
import { ReactNode, Suspense } from "react";

import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Collab-Up",
  description: "A workspace for your team, powered by WebRTC and WebSockets.",
};

const HomeLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Wrapper> {children} </Wrapper>
    </Suspense>
  );
};


const Wrapper = async ({ children }: { children: ReactNode }) => {
  return(
  <main>
        <Navbar />
        <div className="flex">
          <Sidebar />
          <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14">
            <div className="w-full">{children}</div>
            <Footer />
          </section>
        </div>
      </main>
      );
}



// Loader Component
const LoadingScreen = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
    </div>
  );
};

export default HomeLayout;
