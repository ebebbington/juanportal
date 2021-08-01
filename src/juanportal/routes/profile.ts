import express from "express";
const app = express();
import logger from "../helpers/logger";
import ImageHelper from "../helpers/ImageHelper";
import { RedisHelper, IRedisCacheHelper } from "../helpers/RedisHelper";
const Redis = new RedisHelper({ cache: true }) as IRedisCacheHelper;

// For when an image is submitted in the form when POSTing a profile
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.route("/id/:id").get(Redis.cache.route(), (req, res) => {
  const id = req.params.id;
  res.status(200).render("profile/view", { title: "View Profile", id: id });
});

app
  .route("/add")
  /**
   * @example hello
   */
  .get(Redis.cache.route(), (req, res) => {
    res.status(200).render("profile/add", { title: "Add Profile" });
  });

app
  .route("/image")
  /**
   * @example
   * const form = $('form')[0]
   * $.ajax({
      url: '/profile/image?filename=' + filename,
      method: 'post',
      processData: false,
      contentType: false,
      dataType: 'json',
      data: new FormData(form)
    })
   */
  .post(upload.single("image"), (req, res) => {
    // todo add checks so people just cant willy nilly send requests e.g. JWT and ext checks
    logger.info("[POST /profile/image]");
    const filename = req.query.filename as string;
    if (!filename) {
      return res
        .status(400)
        .json({ success: false, message: "No filename was passed in" });
    }
    const Image = new ImageHelper();
    Image.saveToFS(filename, req.file);
    return res.status(200).json({ success: true, message: "Saved the file" });
  })

  /**
   * @example
   * cobst filename: string = 'get the filename here without the path'
   * $.ajax({
      url: '/profile/image?filename=' + filename,
      method: 'delete',
      dataType: 'json',
    })
   */
  .delete(upload.single("image"), (req, res) => {
    // todo add checks so people just cant willy nilly send requests e.g. JWT
    const filename: string = req.query.filename as string;
    if (!filename) {
      return res.status(400).json({
        success: false,
        message: "Filename property passed in must be a string and set",
      });
    }
    if (filename.indexOf("sample.jpg") > -1) {
      return res.status(200).json({
        success: true,
        message:
          "Didn't delete as it is our default picture. But it's all good :)",
      });
    }
    const Image = new ImageHelper();
    // check it exists first
    const exists = Image.existsOnFS(filename);
    if (!exists) {
      return res
        .status(404)
        .json({ success: false, message: "File was not found on the server" });
    }
    Image.deleteFromFS(filename);
    return res.status(200).json({ success: true, message: "Deleted the file" });
  });

export default app;
