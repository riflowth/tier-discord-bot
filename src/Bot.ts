import { Interaction } from 'discord.js';

export default interface Bot {

  onReady();

  onCommand(interaction: Interaction);

}
