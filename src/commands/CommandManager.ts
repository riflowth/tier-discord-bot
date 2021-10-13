import { REST as DiscordApi } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Client, CommandInteraction } from 'discord.js';
import Command from '@/commands/Command';

export default class CommandManager {

  private readonly client: Client;
  private readonly discordApi: DiscordApi;

  private readonly commandByLabel = new Map<string, Command>();

  public constructor(client: Client, discordApi: DiscordApi) {
    this.client = client;
    this.discordApi = discordApi;
  }

  public async register(commands: Command[]): Promise<void> {
    try {
      const registeredCommandMap = await this.client.application.commands.fetch();
      const registeredCommands = registeredCommandMap.map((command) => command.name);

      const applicationId = this.client.application.id;
      const commandsInfo = commands
        .map((command) => command.getInfo())
        .filter((command) => !registeredCommands.includes(command.name));

      if (commandsInfo.length !== 0) {
        await this.discordApi.put(
          Routes.applicationCommands(applicationId), { body: commandsInfo },
        );
        console.log(`Registered new ${commandsInfo.length} commands to Discord successfully`);
      }

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
