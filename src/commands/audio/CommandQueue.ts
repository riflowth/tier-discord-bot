import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { CommandInfo } from '@/commands/Command';
import AudioCommand from '@/commands/audio/AudioCommand';
import TrackPlayer from '@/audio/TrackPlayer';
import Track from '@/audio/Track';
import SongUtil from '@/utils/SongUtil';

export default class CommandPlay extends AudioCommand {

  public getInfo(): CommandInfo {
    return new SlashCommandBuilder()
      .setName('queue')
      .setDescription('list the upcoming tracks')
      .toJSON();
  }

  public async executeAudio(
    interaction: CommandInteraction,
    executor: GuildMember,
    trackPlayer: TrackPlayer,
  ): Promise<void> {
    try {
      if (trackPlayer.getTracks().length === 0) {
        interaction.reply('No track playing');
        return;
      }

      interaction.reply({ embeds: [this.getTrackListEmbed(trackPlayer)] });
    } catch (error: any) {
      console.log('Something went wrong when get queue', error.message);
      interaction.reply('Something went wrong when get queue');
    }
  }

  private getTrackListEmbed(trackPlayer: TrackPlayer): MessageEmbed {
    const currentTrack = trackPlayer.getCurrentTrack();
    const upcomingTracks = trackPlayer.getUpcomingTracks();

    const upcomingTotalDuration = upcomingTracks.reduce(
      (acc, track) => acc + track.getInfo().duration, 0,
    );
    const totalDuration: number = currentTrack.getInfo().duration + upcomingTotalDuration;

    return new MessageEmbed()
      .addField('🔊 Current Track', this.formatTrackQueue([currentTrack]))
      .addField('⏳ Upcoming Track', (upcomingTracks.length !== 0)
        ? this.formatTrackQueue(upcomingTracks, true)
        : 'No upcoming tracks')
      .setFooter(`Total duration: ${SongUtil.getLocaleDuration(totalDuration)}`);
  }

  private formatTrackQueue(tracks: Track[], prefix?: boolean): string {
    const template = '%prefix% `[%duration%]` [%title%](%url%) by <@%by%>';

    return tracks
      .map((track, index) => template
        .replace('%prefix%', prefix ? `\`${(index + 1)}\`.` : '')
        .replace('%duration%', track.getInfo().duration_locale)
        .replace('%title%', track.getInfo().title)
        .replace('%url%', track.getInfo().url)
        .replace('%by%', track.getRequestedBy().id))
      .join('\n');
  }

}
