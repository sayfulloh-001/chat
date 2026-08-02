import { env } from '../config/env';

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8802395423:AAEhd8nQ95O6D-isr3I33hSs_6bgEvkFxUg';

export const sendTelegramNotification = async (chatId: string | number, message: string) => {
  if (!TELEGRAM_TOKEN) return;

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });
  } catch (error) {
    console.error('Telegram notification error:', error);
  }
};
