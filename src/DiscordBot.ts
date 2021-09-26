import { Client, Interaction } from 'discord.js';

export default interface DiscordBot {

  onReady();

  onCommand(interaction: Interaction);

  getClient(): Client;

}