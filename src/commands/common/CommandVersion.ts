import { CommandInteraction, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import Command, { CommandInfo } from '@/commands/Command';
import os from 'os';

export default class CommandVersion implements Command {

  public getInfo(): CommandInfo {
    return new SlashCommandBuilder()
      .setName('version')
      .setDescription('See which version of this bot is running')
      .toJSON();
  }

  public async execute(interaction: CommandInteraction): Promise<void> {
    const { tag } = interaction.client.user;
    const version = process.env.npm_package_version;

    const rssMem = Math.round(((process.memoryUsage().heapUsed / 1024) / 1024) * 100) / 100;
    const totalMem = Math.round(((os.totalmem() / 1024) / 1024) * 100) / 100;

    const embed = new MessageEmbed()
      .setAuthor({
        name: tag,
        iconURL: interaction.client.user.avatarURL(),
        url: 'https://github.com/riflowth/tier-discord-bot',
      })
      .setColor('#448ad0')
      .addFields(
        { name: 'version', value: version, inline: true },
        { name: 'host', value: os.hostname(), inline: true },
        { name: 'run on', value: os.arch(), inline: true },
        { name: 'memory', value: `${rssMem} MB : ${totalMem} MB` },
      );

    interaction.reply({ embeds: [embed] });
  }

}
