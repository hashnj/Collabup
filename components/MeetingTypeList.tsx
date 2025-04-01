"use client";
import React, { useState } from "react";
import HomeCard from "./HomeCard";
import { useRouter } from "next/navigation";
import MeetingModal from "./MeetingModal";
// import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { toast } from "sonner"
// import { useUser } from "hooks/useUser";
import { Textarea } from "./ui/textarea";
import ReactDatePicker from "./ui/ReactDatePicker";
import { Input } from "./ui/input";

// import { useRouter } from "next/router";
// using newer one caused its designed for app directory

const MeetingTypeList = () => {
	// const { toast } = useToast();

	const router = useRouter();
	const [meetingState, setMeetingState] = useState<
		"isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
	>();
	const [values, setValues] = useState({
		dateTime: new Date(),
		description: "",
		link: "",
	});
	const [callDetails, setCallDetails] = useState();
	// const { user } = useUser();
	// const client = useStreamVideoClient();

	const createMeeting = async () => {
		// if (!user || !client) return;

		try {
			if (!values.dateTime) {
				toast.error("Please select a date and Time",);
			}
			// generate random id fir call id
			// const id = crypto.randomUUID();
			// // const call = client.call("default", id);
			// // if (!call) throw new Error("Failed to create meeting");
			// // console.log(call);
			// const startsAt =
			// 	values.dateTime.toISOString() || new Date(Date.now()).toISOString();

			// const description = values.description || "Instant meeting";
			// // creating a meeting

			// console.log("in try 1");
			// // await call.getOrCreate({
			// 	data: {
			// 		starts_at: startsAt,
			// 		custom: {
			// 			description,
			// 		},
			// 	},
			// });

			console.log("in tryt after");
			// setCallDetails(call);

			if (!values.description) {
				// router.push(`/meeting/${call.id}`);
			}
			toast.success("meeting created");
		} catch (e) {
			console.log("in catch");
			console.error(e);
			toast.error("Failed to create meeting");
		}
	};

	// meeting link
	const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails}`;
	return (
		<section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
			<HomeCard
				img='/icons/add-meeting.svg'
				title='New Meeting'
				description='Start an instant meeting'
				handleClick={() => {
					setMeetingState("isInstantMeeting");
					console.log(meetingState);
				}}
				className='bg-orange-500'
			/>
			<HomeCard
				img='/icons/schedule.svg'
				title='Schedule Meeting'
				description='Plan your meeting'
				handleClick={() => setMeetingState("isScheduleMeeting")}
				className='bg-blue-500'
			/>
			
			<HomeCard
				img='/icons/join-meeting.svg'
				title='Join Meeting'
				description='Via Invitation link'
				handleClick={() => setMeetingState("isJoiningMeeting")}
				className='bg-yellow-500'
			/>
			<HomeCard
				img='/icons/copy.svg'
				title='Personal Room'
				description='Your personal room information'
				handleClick={() => router.push("/personal-room")}
				className='bg-purple-500'
			/>

			{!callDetails ? (
				<MeetingModal
					isOpen={meetingState === "isScheduleMeeting"}
					onClose={() => setMeetingState(undefined)}
					title='creating meeting'
					handleClick={() => createMeeting()}>
					<div className='flex flex-col gap-2.5'>
						<label className='text-base text-normal leading-[22px] text-sky-500'>
							Add a description
						</label>
						<Textarea
							className='border border-neutral-300 bg-neutral-100 dark:bg-neutral-950 focus-visible:ring-0 focus-visible:ring-offset-0'
							onChange={(e) =>
								setValues({ ...values, description: e.target.value })
							}
						/>
						<div className='flex w-full flex-col gap-2.5'>
							<label className='text-base text-normal leading-[22px] text-sky-500'>
								Select Date and Time
							</label>
							<ReactDatePicker />
						</div>
					</div>
				</MeetingModal>
			) : (
				<MeetingModal
					isOpen={meetingState === "isScheduleMeeting"}
					onClose={() => setMeetingState(undefined)}
					title='meeting created'
					className='text-center'
					handleClick={() => {
						navigator.clipboard.writeText(meetingLink);
						toast.info("Link Copied");
					}}
					image='/icons/checked.svg'
					buttonIcon='/icons/copy.svg'
					buttonText='Copy Meeting Link'
				/>
			)}
			<MeetingModal
				isOpen={meetingState === "isInstantMeeting"}
				onClose={() => setMeetingState(undefined)}
				title='Start an instant meeting'
				className='text-center'
				buttonText='Start Meeting'
				handleClick={() => createMeeting()}
			/>
			<MeetingModal
				isOpen={meetingState === "isJoiningMeeting"}
				onClose={() => setMeetingState(undefined)}
				title='Type link here'
				className='text-center'
				buttonText='Join Meeting'
				handleClick={() => router.push(values.link)}>
				<Input
					placeholder='meeting link'
					className='border-none bg-dark-2 focus-visible:ring-0 focus-visible:ring-offset-0'
					onChange={(e) => setValues({ ...values, link: e.target.value })}
				/>
			</MeetingModal>
		</section>
	);
};

export default MeetingTypeList;