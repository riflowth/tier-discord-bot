import dotenv from 'dotenv';
import TierDiscordBot from '@/TierDiscordBot';

dotenv.config();
const { TOKEN } = process.env;

new TierDiscordBot(TOKEN).run();
