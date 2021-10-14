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
      const { application } = this.client;

      const registeredCommands = await application.commands.fetch();
      const commandsInfo = commands.map((command) => command.getInfo());
      const commandsName = commandsInfo.map((info) => info.name);

      const hasToRegister = !registeredCommands
        .map((command) => command.name)
        .every((command) => commandsName.includes(command));

      if (hasToRegister) {
        await this.discordApi.put(
          Routes.applicationCommands(application.id), { body: commandsInfo },
        );

        const diff = registeredCommands.filter((command) => !commandsName.includes(command.name));
        console.log(`Registered new ${diff.size} commands to Discord successfully`);
      }

      commands.forEach((command) => {
        this.commandByLabel.set(command.getInfo().name, command);
      });

      console.log(`Registered ${commands.length} commands in-memory successfully`);
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
