import { Telegraf } from 'telegraf'
import express from 'express'
import axios from 'axios'
import dotenv from 'dotenv'
const app = express()

dotenv.config()

const PORT = process.env.PORT || 3000
const API_KEY = process.env.API_KEY
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather'
const bot = new Telegraf(process.env.BOT_TOKEN)
const WEBHOOK_URL = process.env.SERVER_URL

bot.telegram.setWebhook(`${WEBHOOK_URL}/bot${process.env.BOT_TOKEN}`);

app.use(bot.webhookCallback(`/bot${process.env.BOT_TOKEN}`));
// bot.telegram.deleteWebhook();

bot.start((ctx) => {
  ctx.reply(`Привет, ${ctx.from.first_name}!👋 \nДобро пожаловать в нашего бота! Я могу предоставить вам актуальную информацию о погоде.\nВведите:   /weather  [название города ]`)
})

bot.command('weather', async (ctx) => {
  console.log(ctx.message)
  const city = ctx.message.text.split(' ')[1]
  if (!city) return ctx.reply('Название города не указано')

  try {
    const { data } = await axios.get(`${WEATHER_API_URL}`, {
      params: {
        appid: API_KEY,
        q: city,
        units: 'metric',
        lang: 'ru',
      }
    })

    const result = data
    ctx.reply(
      `погода в ${result.name}:\n температура: ${result.main.temp}°C\n описание: ${result.weather[0].description}\n скорость ветра: ${result.wind.speed} m/s`
    )
  } catch (error) {
    console.log(error)
    ctx.reply('ошибка получения данных о погоде')
  }
})



// bot.launch({ polling: true })
bot.launch()


app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})