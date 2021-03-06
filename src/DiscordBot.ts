import { Client, Intents, Interaction } from 'discord.js';
import { REST as DiscordApi } from '@discordjs/rest';
import CommandManager from '@/commands/CommandManager';
import Bot from '@/Bot';
import * as PlayDL from 'play-dl';

export default abstract class DiscordBot implements Bot {

  private readonly intents: number[] = [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ];

  protected readonly token: string;
  protected readonly discordApi: DiscordApi;
  protected readonly commandManager: CommandManager;
  protected readonly client: Client;

  public constructor(token: string) {
    this.token = token;
    this.discordApi = new DiscordApi({ version: '9' }).setToken(token);
    this.client = new Client({ intents: this.intents });
    this.commandManager = new CommandManager(this.client, this.discordApi);
  }

  public async run() {
    this.client.on('ready', this.onReady.bind(this));
    this.client.on('interactionCreate', this.onCommand.bind(this));

    await PlayDL.setToken({
      spotify: {
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
        refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
        market: process.env.SPOTIFY_MARKET,
      },
    });

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
