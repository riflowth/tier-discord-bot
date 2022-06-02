import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  DiscordGatewayAdapterCreator,
  joinVoiceChannel,
  VoiceConnection,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import { GuildMember } from 'discord.js';
import TrackPlayer from '@/audio/TrackPlayer';
import Track from '@/audio/Track';

export default class LocalTrackPlayer implements TrackPlayer {

  public static readonly TIMEOUT = 1000 * 60 * 3;

  private audioPlayer: AudioPlayer;
  private connection: VoiceConnection;

  private tracks: Track[] = new Array<Track>();
  private hasConnected: boolean = false;
  private hasPlayed: boolean = false;
  private timeout: NodeJS.Timeout;

  private async onIdle() {
    const hasNextTrack = await this.next();

    if (!hasNextTrack) {
      this.timeout = setTimeout(() => this.disconnect(), LocalTrackPlayer.TIMEOUT);
    }
  }

  public connect(member: GuildMember): void {
    this.audioPlayer = createAudioPlayer();
    this.audioPlayer.on(AudioPlayerStatus.Idle, this.onIdle.bind(this));

    this.connection = joinVoiceChannel({
      channelId: member.voice.channelId,
      guildId: member.guild.id,
      adapterCreator: member.guild.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator,
      selfDeaf: false,
    });

    this.connection.on(VoiceConnectionStatus.Disconnected, () => {
      this.disconnect();
    });

    this.connection.subscribe(this.audioPlayer);
    this.hasConnected = true;
  }

  public disconnect(): void {
    clearTimeout(this.timeout);
    this.clearTracks();
    this.hasConnected = false;
    this.hasPlayed = false;
    this.audioPlayer = null;
    this.connection.destroy();
  }

  public isConnected(): boolean {
    return this.hasConnected;
  }

  public async queue(track: Track[]): Promise<void> {
    this.tracks.push(...track);

    const loader = this.tracks.map((lodingTrack) => lodingTrack.loadInfo());
    await Promise.all(loader);

    if (!this.isPlaying()) {
      this.hasPlayed = true;
      await this.play(track[0]);
    }
  }

  public async preloadStream(): Promise<void> {
    await this.tracks[0].loadStream();
    if (this.tracks[1]) {
      await this.tracks[1].loadStream();
    }
  }

  public async next(): Promise<boolean> {
    this.tracks.shift();
    const hasNextTrack = (this.tracks.length !== 0);

    if (hasNextTrack) {
      await this.play(this.tracks[0]);
    } else {
      this.stop();
    }

    return hasNextTrack;
  }

  public skip(amount?: number): boolean {
    if ((amount > this.tracks.length) || (amount < 1)) return false;

    this.tracks = this.tracks.slice(amount - 1);
    this.stop();

    return true;
  }

  public async play(track: Track): Promise<void> {
    await this.preloadStream();
    this.audioPlayer.play(track.getResource());
    clearTimeout(this.timeout);
  }

  public stop(): void {
    this.audioPlayer.stop(true);
    this.hasPlayed = false;
  }

  public pause(): void {
    this.audioPlayer.pause();
  }

  public resume(): void {
    this.audioPlayer.unpause();
  }

  public isPlaying(): boolean {
    return this.hasPlayed;
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

  public removeUpcomingTracks(
    fromTrackNumber: number,
    toTrackNumber: number = fromTrackNumber,
  ): boolean {
    const isValidRange = fromTrackNumber > 0 && toTrackNumber >= fromTrackNumber;

    if (!isValidRange) return false;

    if (toTrackNumber > this.getUpcomingTracks().length) return false;

    this.tracks.splice(fromTrackNumber, toTrackNumber - fromTrackNumber + 1);

    return true;
  }

}
