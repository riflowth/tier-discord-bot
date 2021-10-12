import { GuildMember } from 'discord.js';
import Track from '@/audio/Track';

export default interface TrackPlayer {

  connect(member: GuildMember): void;

  isConnected(): boolean;

  play(track: Track): void;

  playNext(): void;

  clearQueue(): void;

  queue(track: Track): void;

  getCurrentTrack(): Track;

  getUpcomingTracks(): Track[];

  skip(amount?: number): boolean;

  pause(): void;

  resume(): void;

  stop(): void;

  isPlaying(): boolean;

}
