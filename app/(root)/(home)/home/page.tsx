"use client";
import MeetingTypeList from "@/components/MeetingTypeList";
import { useTime } from "@/hooks/useTime";
import React from "react";

const Home = () => {
  const { time, date } = useTime();

  return (
    <section className="flex size-full flex-col gap-10 text-white">

      <div className="h-[300px] w-full rounded-[20px] bg-[url(/images/hero-background.png)] bg-cover">
        <div className="flex h-full flex-col justify-between p-4 max-md:px-5 max-md:py-8 lg:p-11">
          <h2 className="max-w-[270px] rounded py-2 text-center text-base font-normal">
            Upcoming meeting at: 4:30 PM
          </h2>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-extrabold lg:text-5xl">{time}</h1>
            <p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
          </div>
        </div>
      </div>

      <MeetingTypeList />
    </section>
  );
};

export default Home;
