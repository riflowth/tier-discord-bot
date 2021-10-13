import { GuildMember } from 'discord.js';
import Track from '@/audio/Track';

export default interface TrackPlayer {

  connect(member: GuildMember): void;

  isConnected(): boolean;

  play(track: Track): void;

  next(): void;

  queue(track: Track): void;

  getTracks(): Track[];

  getCurrentTrack(): Track;

  getUpcomingTracks(): Track[];

  clearTracks(): void;

  clearUpcomingTracks(): number;

  skip(amount?: number): boolean;

  pause(): void;

  resume(): void;

  stop(): void;

  isPlaying(): boolean;

}
