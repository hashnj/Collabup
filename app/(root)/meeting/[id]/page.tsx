"use client";

import { useParams } from "next/navigation";


export default function MeetingPage() {
  const params = useParams();
  const meetingId = params.id as string;

  if (!meetingId) return <p>Loading...</p>;

  return (
    <div className="h-screen w-screen">
    </div>
  );
}


