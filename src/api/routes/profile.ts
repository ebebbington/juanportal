import express from "express";
const app = express();
import ProfileController from "../controllers/ProfileController";

import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app
  .route("/count/:count")

  /**
   * @example
   * const numberOfProfiles = 100
   * $.ajax({
   *  url: '/api/profile/count/numberOfProfiles',
   *  method: 'get',
   *  dataType: 'json'
   * })
   */
  .get(async (req, res) => {
    await ProfileController.GetProfilesByAmount(req, res);
  });

app
  .route("/id/:id")

  /**
   * @example
   * const id = 'get the id here
   * $.ajax({
   *  url: '/api/profile/id/' + id,
   *  method: 'get',
   *  dataType: 'json'
   * })
   */
  .get(ProfileController.GetProfileById)

  /**
   * @example
   * const id = 'get the id here
   * $.ajax({
   *  url: '/api/profile/id/' + id,
   *  method: 'delete',
   *  dataType: 'json'
   * })
   */
  .delete(ProfileController.DeleteProfileById);

app
  .route("/")
  /**
   * @example
   * const form = $('form')[0]
   * $.ajax({
      url: '/api/profile,
      method: 'post',
      processData: false,
      contentType: false,
      dataType: 'json',
      data: new FormData(form)
    })
   */
  // eslint-disable-next-line
  // @ts-ignore
  .post(upload.single("image"), ProfileController.PostProfile);

export default app;
