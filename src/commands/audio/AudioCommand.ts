import { CommandInteraction, GuildMember } from 'discord.js';
import { AudioPlayer } from '@discordjs/voice';
import Command from '@/commands/Command';
import TierDiscordBot from '@/TierDiscordBot';

export default abstract class AudioCommand implements Command {

  private readonly bot: TierDiscordBot;

  public constructor(bot: TierDiscordBot) {
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

    const audioPlayerManager = this.bot.getAudioPlayerManager();
    const audioPlayer = audioPlayerManager.getOrCreate(interaction.guildId);

    this.executeAudio(interaction, executor, audioPlayer);
  }

  public abstract getInfo();

  public abstract executeAudio(
    interaction: CommandInteraction,
    executor: GuildMember,
    audioPlayer: AudioPlayer
  ): Promise<void>;

}
