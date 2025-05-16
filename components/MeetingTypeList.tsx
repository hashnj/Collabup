"use client";

import React, { useEffect, useState } from "react";
import HomeCard from "./HomeCard";
import { useRouter } from "next/navigation";
import MeetingModal from "./MeetingModal";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { useUser } from "@/hooks/useUser";
import { format } from "date-fns";

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

      if (!values.dateTime || !values.description.trim()) {
        toast.error("Please enter a description and select a date/time");
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
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        handleClick={() => setMeetingState("isInstantMeeting")}
        className="bg-orange-500"
      />

      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        handleClick={() => setMeetingState("isScheduleMeeting")}
        className="bg-blue-500"
      />

      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="Via Invitation link"
        handleClick={() => setMeetingState("isJoiningMeeting")}
        className="bg-yellow-500"
      />

      <HomeCard
        img="/icons/copy.svg"
        title="Personal Room"
        description="Your personal room information"
        handleClick={() => router.push("/personal-room")}
        className="bg-purple-500"
      />

      <MeetingModal
        isOpen={meetingState === "isScheduleMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Schedule a Meeting"
        handleClick={createMeeting}
      >
        <div className="flex flex-col gap-2.5">
          <label className="text-base leading-[22px] text-sky-500">Description</label>
          <Textarea
            className="border bg-neutral-100 dark:bg-neutral-950"
            value={values.description}
            onChange={(e) => setValues({ ...values, description: e.target.value })}
            placeholder="Meeting description"
          />
          <div className="flex flex-col gap-2.5">
            <label className="text-base leading-[22px] text-sky-500">Select Date and Time</label>
            <Input
              type="datetime-local"
              value={format(values.dateTime, "yyyy-MM-dd'T'HH:mm")}
              onChange={(e) => setValues({ ...values, dateTime: new Date(e.target.value) })}
            />
          </div>
        </div>
      </MeetingModal>

      <MeetingModal
        isOpen={meetingState === "isInstantMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />

      <MeetingModal
        isOpen={meetingState === "isJoiningMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Join a Meeting"
        buttonText="Join Meeting"
        handleClick={joinMeeting}
      >
        <Input
          placeholder="Enter meeting link"
          value={values.link}
          onChange={(e) => setValues({ ...values, link: e.target.value })}
        />
      </MeetingModal>
    </section>
  );
};

export default MeetingTypeList;
