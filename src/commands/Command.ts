import { CommandInteraction } from 'discord.js';

export type CommandInfo = {
  name: string,
  description: string,
}

export default interface Command {

  getInfo(): CommandInfo;

  execute(interaction: CommandInteraction): Promise<void>;

}
