import { AudioResource, createAudioResource } from '@discordjs/voice';
import * as PlayDL from 'play-dl';
import SongUtil, { SongInfo } from '@/utils/SongUtil';

export default class Track {

  private readonly searchTitle: string;
  private info: SongInfo;
  private resource: AudioResource;
  private isLoading: boolean = true;

  public constructor(searchTitle: string) {
    this.searchTitle = searchTitle;
  }

  public async loadResource(): Promise<void> {
    try {
      const song = (await PlayDL.search(this.searchTitle, { limit: 1 }))[0];
      const stream = await PlayDL.stream(song.url);

      this.info = SongUtil.getInfo(song);
      this.resource = createAudioResource(stream.stream, { inputType: stream.type });
      this.isLoading = false;
    } catch (error: any) {
      throw new Error(`Can't find any song resource from ${this.searchTitle}`);
    }
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
