// app/meeting/ParticipantsList.tsx
"use client";

interface Participant {
  identity: string;
}

interface Room {
  localParticipant: Participant;
  remoteParticipants: Map<string, Participant>;
}

interface ParticipantsListProps {
  room?: Room;
}

const ParticipantsList = ({ room }: ParticipantsListProps) => {
  if (!room) return null;

  const participants = [
    room.localParticipant.identity,
    ...Array.from(room.remoteParticipants.values()).map((p) => p.identity),
  ];

  return (
    <aside className="w-80 bg-gray-800 p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Participants</h3>
      <ul>
        {participants.map((participant) => (
          <li key={participant} className="mb-2 bg-gray-700 p-2 rounded">
            {participant}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default ParticipantsList;
