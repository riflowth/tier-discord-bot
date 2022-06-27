import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import AudioCommand from '@/commands/audio/AudioCommand';
import { CommandInfo } from '@/commands/Command';
import TrackUtil, { Playlist, TrackInfo } from '@/utils/TrackUtil';
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
    const keyword = interaction.options.getString('song');
    try {
      await interaction.deferReply();

      if (!trackPlayer.isConnected()) {
        const isCanConnect = trackPlayer.connect(executor);
        if (!isCanConnect) {
          const voiceChannel = executor.voice.channel;
          interaction.editReply(`🚫 Cannot join the voice channel <#${voiceChannel.id}>`);
          return;
        }
      }

      const playlist = await TrackUtil.getPlaylist(keyword);
      let tracks: Track[] = [];

      if (playlist) {
        tracks = playlist.videoUrls.map((url) => new Track(url, executor));
      } else {
        tracks.push(new Track(keyword, executor));
      }

      await trackPlayer.queue(tracks);

      const replyMessage = (playlist)
        ? this.getPlaylistEmbed(executor, playlist)
        : this.getTrackEmbed(executor, tracks[0].getInfo());

      interaction.editReply({ embeds: [replyMessage] });
      console.log(
        (playlist)
          ? `Server '${executor.guild.name}' plays a playlist: ${keyword} (${tracks.length})`
          : `Server '${executor.guild.name}' plays: ${tracks[0].getInfo().title}`,
      );
    } catch (error: any) {
      interaction.editReply('This track or playlist is unavailable');
      console.log(`Something went wrong on ${keyword}: ${error.message}`);
    }
  }

  private getTrackEmbed(executor: GuildMember, trackInfo: TrackInfo): MessageEmbed {
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

  private getPlaylistEmbed(executor: GuildMember, playlist: Playlist): MessageEmbed {
    return new MessageEmbed()
      .setColor('#659DB4')
      .setTitle(playlist.title)
      .setURL(playlist.url)
      .setAuthor({
        name: playlist.creator_name,
        iconURL: playlist.creator_avatar,
        url: playlist.creator_url,
      })
      .addFields(
        {
          name: 'Number',
          value: `${playlist.videoUrls.length} tracks`,
          inline: true,
        },
        {
          name: 'Duration',
          value: playlist.duration_locale,
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
