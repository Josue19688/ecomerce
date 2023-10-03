
require('dotenv').config();
import * as TelegramBot  from 'node-telegram-bot-api';


process.env.NTBA_FIX_319;

const token:any = process.env.TOKEN;
const bot = new TelegramBot(token, {polling:true});
export const botLogs =async (data:any) => {
    const chatId=1960098520;
    bot.sendMessage(chatId,`${data}`,{parse_mode : "HTML"});
    return true;
}
