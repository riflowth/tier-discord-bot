import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember } from 'discord.js';
import { CommandInfo } from '@/commands/Command';
import AudioCommand from '@/commands/audio/AudioCommand';
import TrackPlayer from '@/audio/TrackPlayer';

export default class CommandRemove extends AudioCommand {

  public getInfo(): CommandInfo {
    return new SlashCommandBuilder()
      .setName('remove')
      .setDescription('Remove the specific track from queue')
      .addIntegerOption((option) => option
        .setName('track_number')
        .setDescription('track number to remove')
        .setRequired(true))
      .toJSON();
  }

  public async executeAudio(
    interaction: CommandInteraction,
    executor: GuildMember,
    trackPlayer: TrackPlayer,
  ): Promise<void> {
    const trackNumber = interaction.options.getInteger('track_number');
    const isSuccess = trackPlayer.removeUpcomingTracks(trackNumber);
    interaction.reply(
      isSuccess
        ? `Remove track \`${trackNumber}\` from queue successfully`
        : 'Invalid track number',
    );
  }

}
