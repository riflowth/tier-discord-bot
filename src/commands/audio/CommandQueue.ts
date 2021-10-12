import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { CommandInfo } from '@/commands/Command';
import AudioCommand from '@/commands/audio/AudioCommand';
import TrackPlayer from '@/audio/TrackPlayer';
import Track from '@/audio/Track';

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
      const currentTrack: Track = trackPlayer.getCurrentTrack();
      const upcomingTracks: Track[] = trackPlayer.getUpcomingTracks();
      if (!currentTrack) {
        interaction.reply('No track playing');
        return;
      }
      const currentTrackReplyEmbed: MessageEmbed = this.getCurrentTrackReplyEmbed(currentTrack);
      const upcomingTrackReplyEmbed: MessageEmbed = this.getUpcomingTrackReplyEmbed(upcomingTracks);
      interaction.reply({ embeds: [currentTrackReplyEmbed, upcomingTrackReplyEmbed] });
    } catch (error: any) {
      interaction.editReply('Something went wrong when get queue');
      console.log('Something went wrong when get queue');
    }
  }

  private getCurrentTrackReplyEmbed(currentTrack: Track): MessageEmbed {
    const { duration_locale: durationLocale, title, url } = currentTrack.getInfo();
    return new MessageEmbed()
      .setColor('#71368A')
      .setTitle('▶️ Current Track')
      .setDescription(`\`[0]\` \`[${durationLocale}]\` [${title}](${url})\n`);
  }

  private getUpcomingTrackReplyEmbed(upcomingTracks: Track[]): MessageEmbed {
    let description: string = '';
    upcomingTracks?.forEach((element, index) => {
      const { duration_locale: durationLocale, title, url } = element.getInfo();
      description += `\`[${index + 1}]\` \`[${durationLocale}]\` [${title}](${url})\n`;
    });
    return new MessageEmbed()
      .setColor('#71368A')
      .setTitle('⏳ Upcoming next')
      .setDescription(description || 'no upcoming tracks');
  }

}
