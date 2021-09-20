import { REST as DiscordApi } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import Command from '@/commands/Command';
import { CommandInteraction } from 'discord.js';

export default class CommandManager {

  private readonly clientId: string;
  private readonly discordApi: DiscordApi;

  private readonly commandByLabel = new Map<string, Command>();

  public constructor(clientId: string, discordApi: DiscordApi) {
    this.clientId = clientId;
    this.discordApi = discordApi;
  }

  public async register(command: Command): Promise<void> {
    try {
      const commandInfo = command.getInfo();

      await this.discordApi.put(
        Routes.applicationCommands(this.clientId),
        {
          body: [{
            name: commandInfo.name,
            description: commandInfo.description,
          }]
        }
      );

      this.commandByLabel.set(commandInfo.name, command);
    } catch (error) {
      console.error(error);
    }
  }

  public async execute(interaction: CommandInteraction): Promise<void> {
    const command: Command = this.commandByLabel.get(interaction.commandName);

    if (!command) return;

    await command.execute(interaction);
  }

}