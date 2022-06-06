import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { CommandInfo } from '@/commands/Command';
import AudioCommand from '@/commands/audio/AudioCommand';
import TrackPlayer from '@/audio/TrackPlayer';
import { TrackInfo } from '@/utils/TrackUtil';

export default class CommandSkip extends AudioCommand {

  public getInfo(): CommandInfo {
    return new SlashCommandBuilder()
      .setName('skip')
      .setDescription('Skip the currently playing song')
      .addIntegerOption((option) => option
        .setName('amount')
        .setDescription('Amount of songs to skip'))
      .toJSON();
  }

  public async executeAudio(
    interaction: CommandInteraction,
    executor: GuildMember,
    trackPlayer: TrackPlayer,
  ): Promise<void> {
    const skipAmount = (interaction.options.getInteger('amount') || 1);
    const isSkipped = trackPlayer.skip(skipAmount);

    if (!isSkipped) {
      interaction.reply('No song to skip to');
      return;
    }

    const remainingTracks = trackPlayer.getTracks().length;

    if (remainingTracks === 0) {
      interaction.reply('⏭️ Skip to the end of tracks');
    } else {
      const replyEmbed = this.getReplyEmbed(executor, trackPlayer.getCurrentTrack().getInfo());
      interaction.reply({ content: '⏭️ Skip to', embeds: [replyEmbed] });
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
        url: trackInfo.url,
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
