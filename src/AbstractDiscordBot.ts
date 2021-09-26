import { Client, Intents, Interaction } from 'discord.js';
import { REST as DiscordApi } from '@discordjs/rest';
import DiscordBot from '@/DiscordBot';
import CommandManager from '@/commands/CommandManager';

export default abstract class AbstractDiscordBot implements DiscordBot {

  private readonly intents: number[] = [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ];

  protected readonly clientId: string;
  protected readonly token: string;
  protected readonly discordApi: DiscordApi;
  protected readonly commandManager: CommandManager;
  protected readonly client: Client;

  public constructor(clientId: string, token: string) {
    this.clientId = clientId;
    this.token = token;
    this.discordApi = new DiscordApi({ version: '9' }).setToken(token);
    this.client = new Client({ intents: this.intents });
    this.commandManager = new CommandManager(this.clientId, this.discordApi);
  }

  public run() {
    this.client.on('ready', this.onReady.bind(this));
    this.client.on('interactionCreate', this.onCommand.bind(this));
    this.client.login(this.token);
  }

  public onCommand(interaction: Interaction) {
    if (!interaction.isCommand()) return;

    this.commandManager.execute(interaction);
  }

  public getClient(): Client {
    return this.client;
  }

  public abstract onReady();

}
