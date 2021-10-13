import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember } from 'discord.js';
import { CommandInfo } from '@/commands/Command';
import AudioCommand from '@/commands/audio/AudioCommand';
import TrackPlayer from '@/audio/TrackPlayer';

export default class CommandClear extends AudioCommand {

  public getInfo(): CommandInfo {
    return new SlashCommandBuilder()
      .setName('clear')
      .setDescription('Clear the upcoming tracks from queue')
      .toJSON();
  }

  public async executeAudio(
    interaction: CommandInteraction,
    executor: GuildMember,
    trackPlayer: TrackPlayer,
  ): Promise<void> {
    const upcomingTracksAmount = trackPlayer.clearUpcomingTracks();
    const replyMessage = upcomingTracksAmount ? `clear ${upcomingTracksAmount} tracks from queue successfully` : 'the queue already empty';
    interaction.reply(replyMessage);
  }

}
