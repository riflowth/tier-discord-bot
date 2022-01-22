import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import AudioCommand from '@/commands/audio/AudioCommand';
import { CommandInfo } from '@/commands/Command';
import { TrackInfo } from '@/utils/TrackUtil';
import TrackPlayer from '@/audio/TrackPlayer';
import Track from '@/audio/Track';

export default class CommandPlay extends AudioCommand {

  public getInfo(): CommandInfo {
    return new SlashCommandBuilder()
      .setName('play')
      .setDescription('Add a song to queue and plays it')
      .addStringOption((option) => option
        .setName('song')
        .setDescription('Song to search for or the link of the song')
        .setRequired(true))
      .toJSON();
  }

  public async executeAudio(
    interaction: CommandInteraction,
    executor: GuildMember,
    trackPlayer: TrackPlayer,
  ): Promise<void> {
    const title = interaction.options.getString('song');
    try {
      await interaction.deferReply();

      if (!trackPlayer.isConnected()) {
        trackPlayer.connect(executor);
      }

      const track = new Track(title, executor);
      await track.loadResource();
      trackPlayer.queue(track);

      const replyMessage = this.getReplyEmbed(executor, track.getInfo());
      interaction.editReply({ embeds: [replyMessage] });

      console.log(`Server '${executor.guild.name}' plays: ${track.getInfo().title}`);
    } catch (error: any) {
      interaction.editReply('This song is unavailable');
      console.log(`Something went wrong on song ${title}: ${error.message}`);
    }
  }

  private getReplyEmbed(executor: GuildMember, trackInfo: TrackInfo): MessageEmbed {
    return new MessageEmbed()
      .setColor('#659DB4')
      .setTitle(trackInfo.title)
      .setURL(trackInfo.url)
      .setAuthor({
        name: trackInfo.author,
        iconURL: trackInfo.author_avatar,
        url: trackInfo.author_url,
      })
      .setThumbnail(trackInfo.thumbnail)
      .addFields(
        {
          name: 'Duration',
          value: trackInfo.duration_locale,
          inline: true,
        },
        {
          name: 'Requested by',
          value: `${executor.displayName} #${executor.user.discriminator}`,
          inline: true,
        },
      );
  }

}
