import express from 'express'
const router = express.Router()
import RedisHelper, {RedisCacheHelper} from '../helpers/RedisHelper'
const Redis = new RedisHelper({cache: true}) as RedisCacheHelper


// On '/' render index.pug in views/ as pug expects it to be in views
router
  .get('/', Redis.cache.route('index'), (req, res) => {
    return res.render('index.pug', { // pass in variables to the file
        title: 'Home'
    })
})

export default router