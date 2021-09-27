import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember } from 'discord.js';
import { CommandInfo } from '@/commands/Command';
import AudioCommand from '@/commands/audio/AudioCommand';
import TrackPlayer from '@/audio/TrackPlayer';

export default class CommandSkip extends AudioCommand {

  public getInfo(): CommandInfo {
    return new SlashCommandBuilder()
      .setName('skip')
      .setDescription('Skip the currently playing song')
      .addIntegerOption((option) => option
        .setName('amount')
        .setDescription('amount of songs to skip'))
      .toJSON();
  }

  public async executeAudio(
    interaction: CommandInteraction,
    executor: GuildMember,
    trackPlayer: TrackPlayer,
  ): Promise<void> {
    trackPlayer.skip(interaction.options.getInteger('amount'));
    const nextTrack = trackPlayer.getCurrentTrack();

    if (nextTrack) {
      interaction.reply(`Skip to ${trackPlayer.getCurrentTrack().getInfo().title}`);
    } else {
      interaction.reply('Skip the currently playing song');
    }
  }

}
