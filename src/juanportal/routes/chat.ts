import express from "express";
const app = express();
import { RedisHelper, IRedisCacheHelper } from "../helpers/RedisHelper";
const Redis = new RedisHelper({ cache: true }) as IRedisCacheHelper;

app.route("/").get(Redis.cache.route("chat"), (req, res) => {
  res.render("chat", { title: "Chat" });
});

export default app;
