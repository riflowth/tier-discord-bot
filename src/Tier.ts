import { Client, Intents, Interaction } from 'discord.js';
import { REST as DiscordApi } from '@discordjs/rest';
import CommandManager from '@/commands/CommandManager';
import PlayCommand from '@/commands/audio/PlayCommand';

export default class Tier {

  private readonly intents: number[] = [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS
  ];

  private readonly clientId: string;
  private readonly token: string;
  private readonly discordApi: DiscordApi;

  private readonly client: Client;
  private readonly commandManager: CommandManager;

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

    this.commandManager.register([
      new PlayCommand()
    ]);
  }

  private onReady() {
    console.log(`Logged in as ${this.client.user.tag}`);
  }

  private onCommand(interaction: Interaction) {
    if (!interaction.isCommand()) return;

    this.commandManager.execute(interaction);
  }

}