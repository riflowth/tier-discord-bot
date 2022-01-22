import { AudioResource, createAudioResource } from '@discordjs/voice';
import * as PlayDL from 'play-dl';
import { GuildMember } from 'discord.js';
import SongUtil, { SongInfo } from '@/utils/SongUtil';

export default class Track {

  private readonly searchTitle: string;
  private readonly requestedBy: GuildMember;
  private info: SongInfo;
  private resource: AudioResource;
  private isLoading: boolean = true;

  public constructor(searchTitle: string, requestedBy: GuildMember) {
    this.searchTitle = searchTitle;
    this.requestedBy = requestedBy;
  }

  public async loadResource(): Promise<void> {
    try {
      const isHttpUrl = this.isValidHttpUrl(this.searchTitle);
      let song;

      if (isHttpUrl) {
        const rawSongInfo = await PlayDL.video_info(this.searchTitle);
        song = rawSongInfo.video_details;
      } else {
        const searchResult = (await PlayDL.search(this.searchTitle, { limit: 1 }))[0];
        song = searchResult;
      }

      const stream = await PlayDL.stream(song.url);

      this.info = SongUtil.getInfo(song);
      this.resource = createAudioResource(stream.stream, { inputType: stream.type });
      this.isLoading = false;
    } catch (error: any) {
      throw new Error(`Can't find any song resource from ${this.searchTitle}`);
    }
  }

  private isValidHttpUrl(string: string): boolean {
    let url: URL;

    try {
      url = new URL(string);
      return ['http:', 'https:'].includes(url.protocol);
    } catch (error: Error | any) {
      return false;
    }
  }

  public getRequestedBy(): GuildMember {
    return this.requestedBy;
  }

  public getResource(): AudioResource {
    return this.resource;
  }

  public getInfo(): SongInfo {
    return this.info;
  }

  public hasLoaded(): boolean {
    return !this.isLoading;
  }

}
