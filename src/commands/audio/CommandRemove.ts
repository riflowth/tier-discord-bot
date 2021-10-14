import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember } from 'discord.js';
import { CommandInfo } from '@/commands/Command';
import AudioCommand from '@/commands/audio/AudioCommand';
import TrackPlayer from '@/audio/TrackPlayer';

export default class CommandRemove extends AudioCommand {

  public getInfo(): CommandInfo {
    return new SlashCommandBuilder()
      .setName('remove')
      .addIntegerOption((option) => option
        .setName('track_number')
        .setDescription('track number to remove')
        .setRequired(true))
      .setDescription('remove the specific track from queue')
      .toJSON();
  }

  public async executeAudio(
    interaction: CommandInteraction,
    executor: GuildMember,
    trackPlayer: TrackPlayer,
  ): Promise<void> {
    const trackNumber = interaction.options.getInteger('track_number');
    const isSuccess = trackPlayer.removeUpcomingTracks(trackNumber);
    interaction.reply(isSuccess ? `remove track \`${trackNumber}\` from queue successfully` : 'invalid track number');
  }

}
