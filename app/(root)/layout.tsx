
import { Metadata } from "next";
import React, { ReactNode } from "react";

export const metadata: Metadata = {
  title: 'Collab-Up',
  description: 'A workspace for your team, powered by Stream Chat and Clerk.',
};

const HomeLayout = ({ children }: { children: ReactNode }) => {
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
