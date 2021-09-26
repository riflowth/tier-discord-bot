import { AudioPlayer, createAudioPlayer } from '@discordjs/voice';

export default class AudioPlayerManager {

  private readonly audioPlayerByGuidId = new Map<string, AudioPlayer>();

  public getOrCreate(guildId: string): AudioPlayer {
    if (!this.audioPlayerByGuidId.has(guildId)) {
      this.audioPlayerByGuidId.set(guildId, createAudioPlayer());
    }

    return this.audioPlayerByGuidId.get(guildId);
  }

}