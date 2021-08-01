import express from "express";
const app = express();
import { RedisHelper, IRedisCacheHelper } from "../helpers/RedisHelper";
const Redis = new RedisHelper({ cache: true }) as IRedisCacheHelper;

app.route("/").get(Redis.cache.route(), (req, res) => {
  res.status(200).render("index.pug", {
    title: "Home",
  });
});

export default app;
