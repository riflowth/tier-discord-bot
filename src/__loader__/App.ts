import dotenv from 'dotenv';
import TierDiscordBot from '@/TierDiscordBot';

dotenv.config();
const { CLIENT_ID, TOKEN } = process.env;

new TierDiscordBot(CLIENT_ID, TOKEN).run();
