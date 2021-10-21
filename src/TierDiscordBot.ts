import TrackPlayerManager from '@/audio/TrackPlayerManager';
import CommandPlay from '@/commands/audio/CommandPlay';
import CommandSkip from '@/commands/audio/CommandSkip';
import CommandQueue from '@/commands/audio/CommandQueue';
import CommandClear from '@/commands/audio/CommandClear';
import CommandRemove from '@/commands/audio/CommandRemove';
import DiscordBot from '@/DiscordBot';
import TierBot from '@/TierBot';
import CommandVersion from '@/commands/common/CommandVersion';

export default class TierDiscordBot extends DiscordBot implements TierBot {

  private readonly trackPlayerManager: TrackPlayerManager = new TrackPlayerManager();

  public onReady() {
    console.log(`Logged in as ${this.client.user.tag}`);

    this.client.user.setPresence({ activities: [{ name: 'a chill and soul' }] });

    this.commandManager.register([
      new CommandVersion(),
      new CommandPlay(this),
      new CommandSkip(this),
      new CommandQueue(this),
      new CommandClear(this),
      new CommandRemove(this),
    ]);
  }

  public getTrackPlayerManager(): TrackPlayerManager {
    return this.trackPlayerManager;
  }

}
