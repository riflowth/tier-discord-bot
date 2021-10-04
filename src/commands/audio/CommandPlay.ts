import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import AudioCommand from '@/commands/audio/AudioCommand';
import { CommandInfo } from '@/commands/Command';
import { SongInfo } from '@/utils/SongUtil';
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
    const song = interaction.options.getString('song');
    try {
      await interaction.deferReply();

      if (!trackPlayer.isConnected()) {
        trackPlayer.connect(executor);
      }

      const track = new Track(song);
      await track.loadResource();
      trackPlayer.queue(track);

      const replyMessage = this.getReplyEmbed(executor, track.getInfo());
      interaction.editReply({ embeds: [replyMessage] });
      console.log(`Server '${executor.guild.name}' plays: ${track.getInfo().title}`);
    } catch (error: any) {
      interaction.editReply('This song is unavailable');
      console.log(`Something went wrong on song ${song}: ${error.name}`);
    }
  }

  private getReplyEmbed(executor: GuildMember, songInfo: SongInfo): MessageEmbed {
    return new MessageEmbed()
      .setColor('#659DB4')
      .setTitle(songInfo.title)
      .setURL(songInfo.url)
      .setAuthor(songInfo.author, songInfo.author_avatar, songInfo.author_url)
      .setThumbnail(songInfo.thumbnail)
      .addFields(
        {
          name: 'Duration',
          value: songInfo.duration_locale,
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
