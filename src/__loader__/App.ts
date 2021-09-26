import Tier from '@/TierBot';
import dotenv from 'dotenv';

dotenv.config();
const { CLIENT_ID, TOKEN } = process.env;

new Tier(CLIENT_ID, TOKEN).run();