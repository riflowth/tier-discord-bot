import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import Command, { CommandInfo } from '@/commands/Command';

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

    interaction.reply(`\`${tag}\` running on version \`${version}\``);
  }

}
