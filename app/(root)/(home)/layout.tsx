import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Metadata } from "next";
import { ReactNode, Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Collab-Up",
  description: "A workspace for your team, powered by WebRTC and WebSockets.",
};

const HomeLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AuthWrapper>{children}</AuthWrapper>
    </Suspense>
  );
};

const AuthWrapper = async ({ children }: { children: ReactNode }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login"); 
  }

  return (
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
};

// Loader Component
const LoadingScreen = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
    </div>
  );
};

export default HomeLayout;
