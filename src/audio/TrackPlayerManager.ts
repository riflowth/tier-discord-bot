import TrackPlayer from '@/audio/TrackPlayer';
import LocalTrackPlayer from '@/audio/local/LocalTrackPlayer';

export default class TrackPlayerManager {

  private readonly trackPlayerByGuildId = new Map<string, TrackPlayer>();

  public getOrCreate(guildId: string): TrackPlayer {
    if (!this.trackPlayerByGuildId.has(guildId)) {
      this.trackPlayerByGuildId.set(guildId, new LocalTrackPlayer());
    }

    return this.trackPlayerByGuildId.get(guildId);
  }

}
