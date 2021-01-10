import express from "express";
const app = express();
// eslint-disable-next-line
// @ts-ignore
import { RedisHelper, IRedisCacheHelper } from "../helpers/RedisHelper";
// eslint-disable-next-line
// @ts-ignore
const Redis = new RedisHelper({ cache: true }) as IRedisCacheHelper;

app.route("/").get(Redis.cache.route("chat"), (req, res) => {
  res.render("chat", { title: "Chat" });
});

export default app;
