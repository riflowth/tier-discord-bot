import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { CommandInfo } from '@/commands/Command';
import AudioCommand from '@/commands/audio/AudioCommand';
import TrackPlayer from '@/audio/TrackPlayer';
import { SongInfo } from '@/utils/SongUtil';

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
    const isSkipped = trackPlayer.skip(interaction.options.getInteger('amount') || 1);

    if (!isSkipped) {
      interaction.reply('No song to skip to');
      return;
    }

    const nextTrack = trackPlayer.getCurrentTrack();

    if (nextTrack) {
      const replyEmbed = this.getReplyEmbed(executor, nextTrack.getInfo());
      interaction.reply({ content: 'Skip to', embeds: [replyEmbed] });
    } else {
      interaction.reply('Skip the currently playing song');
    }
  }

  private getReplyEmbed(executor: GuildMember, songInfo: SongInfo): MessageEmbed {
    return new MessageEmbed()
      .setColor('#659DB4')
      .setTitle(songInfo.title)
      .setURL(songInfo.url)
      .setAuthor(songInfo.author, songInfo.author_avatar, songInfo.url)
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
