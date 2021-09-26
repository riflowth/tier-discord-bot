import AudioCommand from '@/commands/audio/AudioCommand';
import { CommandInfo } from '@/commands/Command';
import SongUtil, { SongInfo } from '@/utils/SongUtil';
import { SlashCommandBuilder } from '@discordjs/builders';
import { AudioPlayer, createAudioResource, joinVoiceChannel } from '@discordjs/voice';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import * as PlayDL from 'play-dl';

export default class CommandPlay extends AudioCommand {

  public getInfo(): CommandInfo {
    return new SlashCommandBuilder()
      .setName('play')
      .setDescription('Add a song to queue and plays it')
      .addStringOption((option) =>
        option
          .setName('song')
          .setDescription('Song to search for or the link of the song')
          .setRequired(true)
      )
      .toJSON();
  }

  public async executeAudio(interaction: CommandInteraction, executor: GuildMember, audioPlayer: AudioPlayer): Promise<void> {
    try {
      const song = (await PlayDL.search(interaction.options.getString('song'), { limit: 1 }))[0];
      const stream = await PlayDL.stream(song.url);

      const resource = createAudioResource(stream.stream, { inputType: stream.type });
      const connection = joinVoiceChannel({
        channelId: executor.voice.channelId,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator
      });

      connection.subscribe(audioPlayer);
      audioPlayer.play(resource);

      const songInfo = SongUtil.getInfo(song);
      const replyMessage = this.getReplyMessage(executor, songInfo);

      interaction.reply({ embeds: [replyMessage] });
    } catch (error: any) {
      interaction.reply('This song is unavailable');
    }
  }

  private getReplyMessage(executor: GuildMember, songInfo: SongInfo): MessageEmbed {
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
          inline: true
        },
        {
          name: 'Requested by',
          value: `${executor.displayName} #${executor.user.discriminator}`,
          inline: true
        }
      );
  }

}
