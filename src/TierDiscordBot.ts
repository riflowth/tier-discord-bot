import AudioPlayerManager from '@/audio/AudioPlayerManager';
import { Client } from 'discord.js';

export default interface TierDiscordBot {

  getAudioPlayerManager(): AudioPlayerManager;

  getClient(): Client;

}