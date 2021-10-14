import {
  AudioPlayer, AudioPlayerStatus, createAudioPlayer, joinVoiceChannel, VoiceConnectionStatus,
} from '@discordjs/voice';
import { GuildMember } from 'discord.js';
import TrackPlayer from '@/audio/TrackPlayer';
import Track from '@/audio/Track';

export default class LocalTrackPlayer implements TrackPlayer {

  private readonly audioPlayer: AudioPlayer;

  private tracks: Track[] = new Array<Track>();
  private hasConnected: boolean = false;
  private hasPlayed: boolean = false;

  public constructor() {
    this.audioPlayer = createAudioPlayer();

    this.audioPlayer.on(AudioPlayerStatus.Idle, () => {
      this.next();
    });
  }

  public connect(member: GuildMember): void {
    const connection = joinVoiceChannel({
      channelId: member.voice.channelId,
      guildId: member.guild.id,
      adapterCreator: member.guild.voiceAdapterCreator,
      selfDeaf: false,
    });

    connection.on(VoiceConnectionStatus.Disconnected, () => {
      this.hasConnected = false;
      this.clearTracks();
      this.audioPlayer.stop();
      connection.destroy();
    });

    connection.subscribe(this.audioPlayer);
    this.hasConnected = true;
  }

  public isConnected(): boolean {
    return this.hasConnected;
  }

  public play(track: Track): void {
    this.audioPlayer.play(track.getResource());
  }

  public next(): void {
    this.tracks.shift();

    if (this.tracks.length !== 0) {
      this.play(this.tracks[0]);
    } else {
      this.stop();
    }
  }

  public queue(track: Track): void {
    this.tracks.push(track);

    if (!this.isPlaying()) {
      this.play(track);
      this.hasPlayed = true;
    }
  }

  public clearTracks(): void {
    this.tracks = new Array<Track>();
  }

  public getTracks(): Track[] {
    return this.tracks;
  }

  public getCurrentTrack(): Track {
    return this.tracks[0];
  }

  public getUpcomingTracks(): Track[] {
    return this.tracks.slice(1);
  }

  public clearUpcomingTracks(): number {
    const upcomingTracksAmount = this.getUpcomingTracks().length;

    this.tracks.length = upcomingTracksAmount ? 1 : 0;

    return upcomingTracksAmount;
  }

  removeUpcomingTracks(fromTrackNumber: number, toTrackNumber: number = fromTrackNumber): boolean {
    const isValidRange = fromTrackNumber > 0 && toTrackNumber >= fromTrackNumber;

    if (!isValidRange) return false;

    if (toTrackNumber > this.getUpcomingTracks().length) return false;

    this.tracks.splice(fromTrackNumber, toTrackNumber - fromTrackNumber + 1);

    return true;
  }

  public skip(amount?: number): boolean {
    if ((amount > this.tracks.length) || (amount < 1)) return false;

    this.tracks = this.tracks.slice(amount - 1);
    this.next();

    return true;
  }

  public pause(): void {
    this.audioPlayer.pause();
    this.hasPlayed = false;
  }

  public resume(): void {
    this.audioPlayer.unpause();
    this.hasPlayed = true;
  }

  public stop(): void {
    this.audioPlayer.stop(true);
    this.hasPlayed = false;
  }

  public isPlaying(): boolean {
    return this.hasPlayed;
  }

}
