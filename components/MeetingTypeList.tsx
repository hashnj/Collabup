// components/MeetingTypeList.tsx
"use client";

import React, { useEffect, useState } from "react";
import HomeCard from "./HomeCard";
import { useRouter } from "next/navigation";
import MeetingModal from "./MeetingModal";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "./ui/input";
import { useUser } from "@/hooks/useUser";

const MeetingTypeList = () => {
  const router = useRouter();
  const { user } = useUser() as { user: { userName: string } | null };
  const [meetingState, setMeetingState] = useState<
    "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
  >();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });


  const createMeeting = async () => {
    try {
      const id = crypto.randomUUID();
      if (meetingState === "isInstantMeeting" && user) {
        toast.success("Instant meeting created");
        router.push(`/meeting/${user.userName}/${id}`);
        return;
      }

      if (!values.dateTime) {
        toast.error("Please select a date and time");
        return;
      }

      toast.success("Scheduled meeting created");
      router.push(`/meeting/guest/${id}`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to create meeting");
    }
  };

  const joinMeeting = () => {
    if (!values.link.trim()) {
      toast.error("Please enter a meeting link");
      return;
    }
    router.push(values.link.trim());
  };

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {/* Instant Meeting */}
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        handleClick={() => setMeetingState("isInstantMeeting")}
        className="bg-orange-500"
      />

      {/* Schedule Meeting */}
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        handleClick={() => setMeetingState("isScheduleMeeting")}
        className="bg-blue-500"
      />

      {/* Join Meeting */}
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="Via Invitation link"
        handleClick={() => setMeetingState("isJoiningMeeting")}
        className="bg-yellow-500"
      />

      {/* Personal Room */}
      <HomeCard
        img="/icons/copy.svg"
        title="Personal Room"
        description="Your personal room information"
        handleClick={() => router.push("/personal-room")}
        className="bg-purple-500"
      />

      {/* Modals for Different Meeting States */}
      <MeetingModal
        isOpen={meetingState === "isScheduleMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Schedule a Meeting"
        handleClick={() => createMeeting()}
      >
        <div className="flex flex-col gap-2.5">
          <label className="text-base leading-[22px] text-sky-500">Description</label>
          <Textarea
            className="border bg-neutral-100 dark:bg-neutral-950"
            onChange={(e) => setValues({ ...values, description: e.target.value })}
            placeholder="Meeting description"
          />
          <div className="flex flex-col gap-2.5">
            <label className="text-base leading-[22px] text-sky-500">Select Date and Time</label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date: Date | null) => {
                if (date) {
                  setValues({ ...values, dateTime: date });
                }
              }}
            />
          </div>
        </div>
      </MeetingModal>

      <MeetingModal
        isOpen={meetingState === "isInstantMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={() => createMeeting()}
      />

      <MeetingModal
        isOpen={meetingState === "isJoiningMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Join a Meeting"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={joinMeeting}
      >
        <Input
          placeholder="Enter meeting link"
          className="border-none bg-dark-2"
          value={values.link}
          onChange={(e) => setValues({ ...values, link: e.target.value })}
        />
      </MeetingModal>
    </section>
  );
};

export default MeetingTypeList;
