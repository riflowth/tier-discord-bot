import CommandPlay from '@/commands/audio/CommandPlay';
import AbstractDiscordBot from '@/AbstractDiscordBot';
import TierDiscordBot from '@/TierDiscordBot';
import AudioPlayerManager from '@/audio/AudioPlayerManager';

export default class TierBot extends AbstractDiscordBot implements TierDiscordBot {

  private readonly audioPlayerManager: AudioPlayerManager = new AudioPlayerManager();

  public onReady() {
    console.log(`Logged in as ${this.client.user.tag}`);

    this.client.user.setPresence({ activities: [{ name: 'a chill and soul' }] });

    this.commandManager.register([
      new CommandPlay(this)
    ]);
  }

  public getAudioPlayerManager(): AudioPlayerManager {
    return this.audioPlayerManager;
  }

}