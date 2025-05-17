
import { Metadata } from "next";
import React, { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: 'Collab-Up',
  description: 'A workspace for your team, powered by Stream Chat and Clerk.',
};

const HomeLayout = ({ children }: { children: ReactNode }) => {
  
	return (
		
						
					<AuthWrapper>{children}</AuthWrapper>
						
					
	);
};

const AuthWrapper = async ({ children }: { children: ReactNode }) => {
 const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login"); 
  }

  return (
    <main>
			<div className='flex'>
				<section className='flex min-h-screen flex-1 flex-col '>
					<div className='w-full'>
            {children}
    </div>
				</section>
			</div>
		</main>
  );
};

export default HomeLayout;
