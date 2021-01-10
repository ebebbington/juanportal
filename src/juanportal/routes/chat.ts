import express from 'express'
const app = express()
import RedisHelper, { RedisCacheHelper } from '../helpers/RedisHelper'
const Redis: RedisCacheHelper = new RedisHelper({cache: true}) as RedisCacheHelper

app.route('/')
  .get(Redis.cache.route('chat'), (req, res) => {
      res.render('chat', {title: 'Chat'})
  })

export default app