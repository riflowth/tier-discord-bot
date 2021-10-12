import { REST as DiscordApi } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { CommandInteraction } from 'discord.js';
import Command from '@/commands/Command';

export default class CommandManager {

  private readonly clientId: string;
  private readonly discordApi: DiscordApi;

  private readonly commandByLabel = new Map<string, Command>();

  public constructor(clientId: string, discordApi: DiscordApi) {
    this.clientId = clientId;
    this.discordApi = discordApi;
  }

  public async register(commands: Command[]): Promise<void> {
    try {
      const commandsInfo = commands.map((command) => command.getInfo());

      await this.discordApi.put(
        Routes.applicationGuildCommands(this.clientId, '835981109237252147'), { body: commandsInfo },
      );

      commands.forEach((command) => {
        this.commandByLabel.set(command.getInfo().name, command);
      });

      console.log(`Registered ${commands.length} commands successfully`);
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
