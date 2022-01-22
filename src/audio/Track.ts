import { AudioResource, createAudioResource } from '@discordjs/voice';
import * as PlayDL from 'play-dl';
import { GuildMember } from 'discord.js';
import TrackUtil, { TrackInfo } from '@/utils/TrackUtil';
import YoutubeResolver from '@/audio/resolver/YoutubeResolver';

export default class Track {

  private readonly searchTitle: string;
  private readonly requestedBy: GuildMember;
  private info: TrackInfo;
  private resource: AudioResource;
  private isLoading: boolean = true;

  public constructor(searchTitle: string, requestedBy: GuildMember) {
    this.searchTitle = searchTitle;
    this.requestedBy = requestedBy;
  }

  public async loadResource(): Promise<void> {
    try {
      let result = await YoutubeResolver.resolveByUrl(this.searchTitle);
      if (!result) result = await YoutubeResolver.resolveByTitle(this.searchTitle);

      const stream = await PlayDL.stream(result.url);

      this.info = TrackUtil.getInfo(result);
      this.resource = createAudioResource(stream.stream, { inputType: stream.type });
      this.isLoading = false;
    } catch (error: any) {
      throw new Error(`Can't find any song resource from ${this.searchTitle}`);
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
