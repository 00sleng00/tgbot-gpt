import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import { code } from 'telegraf/format'
import config from 'config'
import { ogg } from './ogg.js'
import { openai } from './openai.js'
import { removeFile } from './utils.js'
import { initCommand, processTextToChat, INITIAL_SESSION } from './logic.js'

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'))

bot.command('start', async (ctx) => {
   // Удаление сообщения /start
   ctx.deleteMessage(ctx.message.message_id)
      .catch((error) => {
         console.error('Ошибка при удалении сообщения:', error);
      });
   console.info('Bot: start')
   initCommand(ctx);
});


bot.command('new', async (ctx) => {
   ctx.deleteMessage(ctx.message.message_id)
      .catch((error) => {
         console.error('Ошибка при удалении сообщения:', error)
      });

   console.info('Bot: new')
   ctx.reply('Начат новый диалог.', initCommand(ctx))
})


bot.on(message('voice'), async (ctx) => {
   ctx.session ??= INITIAL_SESSION
   try {

      await ctx.reply(code('Сообщение принял. Жду ответ от сервера...'))
      const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
      const userId = String(ctx.message.from.id)
      const oggPath = await ogg.create(link.href, userId)
      const mp3Path = await ogg.toMp3(oggPath, userId)
      console.info('Bot: voice from ', userId)

      removeFile(oggPath)

      const text = await openai.transcription(mp3Path)
      await ctx.reply(code(`Ваш запрос: ${text}`))

      await processTextToChat(ctx, text)
   } catch (e) {
      console.error(`Error while voice message`, e)
   }
})

bot.on(message('text'), async (ctx) => {
   ctx.session ??= INITIAL_SESSION
   try {
      const userId = String(ctx.message.from.id)
      console.info('Bot: text from ', userId, ' Mess:' ,ctx.message.text)
      await ctx.reply(code('Сообщение принял. Жду ответ от сервера...'))
      await processTextToChat(ctx, ctx.message.text)
   } catch (e) {
      console.error(`Error while voice message`, e)
   }
})



bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))