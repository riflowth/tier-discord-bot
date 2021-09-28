import {
  AudioPlayer, AudioPlayerStatus, createAudioPlayer, joinVoiceChannel,
} from '@discordjs/voice';
import { GuildMember } from 'discord.js';
import TrackPlayer from '@/audio/TrackPlayer';
import Track from '@/audio/Track';

export default class LocalTrackPlayer implements TrackPlayer {

  private readonly audioPlayer: AudioPlayer;

  private trackQueue: Track[] = new Array<Track>();
  private currentTrack: Track = null;
  private hasConnected: boolean = false;
  private hasPlayed: boolean = false;

  public constructor() {
    this.audioPlayer = createAudioPlayer();

    this.audioPlayer.on(AudioPlayerStatus.Idle, () => {
      this.playNext();
    });
  }

  public connect(member: GuildMember): void {
    const connection = joinVoiceChannel({
      channelId: member.voice.channelId,
      guildId: member.guild.id,
      adapterCreator: member.guild.voiceAdapterCreator,
    });

    connection.subscribe(this.audioPlayer);
    this.hasConnected = true;
  }

  public isConnected(): boolean {
    return this.hasConnected;
  }

  public play(track: Track): void {
    this.currentTrack = track;
    this.audioPlayer.play(track.getResource());
  }

  public playNext(): void {
    if (this.trackQueue.length !== 0) {
      this.play(this.trackQueue.shift());
    } else {
      this.currentTrack = null;
      this.hasPlayed = false;
    }
  }

  public queue(track: Track): void {
    if (!this.isPlaying()) {
      this.play(track);
      this.hasPlayed = true;
    } else {
      this.trackQueue.push(track);
    }
  }

  public getCurrentTrack(): Track {
    return this.currentTrack;
  }

  public skip(amount?: number): boolean {
    if (amount > this.trackQueue.length + (this.currentTrack !== null ? 1 : 0)) {
      return false;
    }

    if (amount > 1) {
      this.trackQueue = this.trackQueue.slice(amount - 1);
      this.play(this.trackQueue.shift());
    } else {
      this.stop();
    }

    return true;
  }

  public pause(): void {
    this.audioPlayer.pause();
  }

  public resume(): void {
    this.audioPlayer.unpause();
  }

  public stop(): void {
    this.audioPlayer.stop(true);
  }

  public isPlaying(): boolean {
    return this.hasPlayed;
  }

}
