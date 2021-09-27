import { CommandInteraction, GuildMember } from 'discord.js';
import Command from '@/commands/Command';
import TierBot from '@/TierBot';
import TrackPlayer from '@/audio/TrackPlayer';

export default abstract class AudioCommand implements Command {

  private readonly bot: TierBot;

  public constructor(bot: TierBot) {
    this.bot = bot;
  }

  public async execute(interaction: CommandInteraction): Promise<void> {
    if (!(interaction.member instanceof GuildMember)) return;

    const executor = interaction.member;
    const voiceChannel = executor.voice.channel;

    if (!voiceChannel) {
      interaction.reply('Please connect to a voice channel to perform this command');
      return;
    }

    const trackPlayerManager = this.bot.getTrackPlayerManager();
    const trackPlayer = trackPlayerManager.getOrCreate(interaction.guildId);

    this.executeAudio(interaction, executor, trackPlayer);
  }

  public abstract getInfo();

  public abstract executeAudio(
    interaction: CommandInteraction,
    executor: GuildMember,
    trackPlayer: TrackPlayer
  ): Promise<void>;

}
