export type UserID = string;

export interface PeerData {
  peerId: UserID;
  stream: MediaStream;
}
