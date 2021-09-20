import Command, { CommandInfo } from '@/commands/Command';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export default class PlayCommand implements Command {

  public getInfo(): CommandInfo  {
    return new SlashCommandBuilder()
      .setName('play')
      .setDescription('player description')
      .toJSON();
  }

  public async execute(interaction: CommandInteraction): Promise<void> {
    interaction.reply('play');
  }

}