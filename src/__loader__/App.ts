import dotenv from 'dotenv';
import Tier from '@/TierBot';

dotenv.config();
const { CLIENT_ID, TOKEN } = process.env;

new Tier(CLIENT_ID, TOKEN).run();
