
import React from "react";

import {
	Dialog,
	DialogContent,
	DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface MeetingModalProps {
	isOpen: boolean;
	onClose: () => void;
	children?: React.ReactNode;
	title: string;
	className?: string;
	handleClick?: () => void;
	image?: string;
	buttonIcon?: string;
	buttonText?: string;
}

const MeetingModal = ({
	isOpen,
	onClose,
	title,
	className,
	children,
	handleClick,
	buttonText,
	image,
	buttonIcon,
}: MeetingModalProps) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent
				className='flex w-full max-w-[520px]
			flex-col gap-6 border-none bg-neutral-100 dark:bg-neutral-950 text-neutral-950 px-6 py-9 dark:text-white'
			>
				<DialogTitle className='sronly'></DialogTitle>
				<div className='flex flex-col gap-6'>
					{image && (
						<div className='flex justify-center'>
							<Image src={image} alt={"image"} width={72} height={72} />
						</div>
					)}
					<h1 className={cn("text-3xl font-bold leading-[42px]", className)}>
						{title}
					</h1>
					{children}
					<Button
						className='bg-blue-500 text-white focus-visible:ring-0 focus-visible:ring-offset-0'
						onClick={handleClick}>
						{buttonIcon && (
							<Image
								src={buttonIcon}
								alt='button icon'
								width={13}
								height={13}
							/>
						)}{" "}
						&nbsp;
						{buttonText || "Schedule Meeting"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default MeetingModal;