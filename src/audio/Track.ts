import { AudioResource, createAudioResource } from '@discordjs/voice';
import * as PlayDL from 'play-dl';
import { GuildMember } from 'discord.js';
import TrackUtil, { TrackInfo } from '@/utils/TrackUtil';
import YoutubeResolver from '@/audio/resolver/YoutubeResolver';

export default class Track {

  private readonly keyword: string;
  private readonly requestedBy: GuildMember;
  private result: PlayDL.YouTubeVideo;
  private timestamp: number = 0;
  private info: TrackInfo;
  private resource: AudioResource;
  private isLoading: boolean = true;

  public constructor(keyword: string, requestedBy: GuildMember) {
    this.keyword = keyword;
    this.requestedBy = requestedBy;
  }

  public async loadInfo(): Promise<void> {
    try {
      if (PlayDL.is_expired()) await PlayDL.refreshToken();

      let loadByUrl = true;

      let result = await YoutubeResolver.resolveByUrl(this.keyword);
      if (!result) {
        result = await YoutubeResolver.resolveByTitle(this.keyword);
        loadByUrl = false;
      }

      if (loadByUrl) {
        const resourceUrl = new URL(this.keyword);
        this.timestamp = Number(resourceUrl.searchParams.get('t')) || 0;
      }

      this.result = result;
      this.info = TrackUtil.getInfo(result);
    } catch (error: Error | any) {
      throw new Error(`Can't find any song resource from ${this.keyword}: ${error.message}`);
    }
  }

  public async loadStream(): Promise<void> {
    try {
      if (PlayDL.is_expired()) await PlayDL.refreshToken();

      const stream = await PlayDL.stream(this.result.url, { seek: this.timestamp });

      this.resource = createAudioResource(stream.stream, { inputType: stream.type });
      this.isLoading = false;
    } catch (error: Error | any) {
      throw new Error(`Can't find any song resource from ${this.keyword}: ${error.message}`);
    }
  }

  public getRequestedBy(): GuildMember {
    return this.requestedBy;
  }

  public getResource(): AudioResource {
    return this.resource;
  }

  public getInfo(): TrackInfo {
    return this.info;
  }

  public hasLoaded(): boolean {
    return !this.isLoading;
  }

}
