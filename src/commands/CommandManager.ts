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
      const registeredCommandsName = registeredCommands.map((info) => info.name).sort();

      const commandsInfo = commands.map((command) => command.getInfo());
      const commandsName = commandsInfo.map((info) => info.name).sort();

      const hasToRegister = (
        (registeredCommandsName.length !== commandsName.length)
        || !(commandsName.every((command) => registeredCommandsName.includes(command)))
      );

      if (hasToRegister) {
        await this.discordApi.put(
          Routes.applicationCommands(application.id), { body: commandsInfo },
        );

        const addition = commandsName
          .filter((command) => !registeredCommandsName.includes(command)).length;

        const deletion = registeredCommandsName
          .filter((command) => !commandsName.includes(command))
          .length;

        if (addition) {
          console.log(`Registered new ${addition} commands to Discord successfully`);
        } else {
          console.log(`Unregistered ${deletion} commands from Discord successfully`);
        }
      }

      commands.forEach((command) => {
        this.commandByLabel.set(command.getInfo().name, command);
      });

      console.log('Commands:', commandsName);
      console.log(`Registered ${commands.length} commands in-memory successfully`);
    } catch (error) {
      console.error(error);
    }
  }

  public async execute(interaction: CommandInteraction): Promise<void> {
    const command: Command = this.commandByLabel.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error: any) {
      console.log(`Error on command ${interaction.commandName} : ${error.message}`);
    }
  }

}
