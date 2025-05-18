// app/meeting/VideoGrid.tsx
"use client";

import { useTracks, VideoTrack } from "@livekit/components-react";
import { Track } from "livekit-client";

const VideoGrid = () => {
  const trackRefs = useTracks([Track.Source.Camera]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {trackRefs.map((trackRef) => (
        <div key={trackRef.publication.trackSid} className="relative">
          <VideoTrack trackRef={trackRef} className="rounded-lg shadow-lg" />
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;
