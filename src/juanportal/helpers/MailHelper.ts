"use strict";

const nodemailer = require('nodemailer')
const mail = require('../juanportal.config.js')['mail']
const logger = require('./logger.js')

/**
 * @class MailHelper
 * 
 * @description Send emails from the server
 * 
 * @author Edward bebbington
 * 
 * @method send Send email email
 * 
 */
class MailHelper {

  /**
   * Send an email
   * 
   * @method send
   * 
   * @example
   * MailHelper.send(data).catch((err) => {
   *   logger.error('Failed to send an email. Most likely because the password isnt set in the config')
   * })
   * 
   * @description Gets the servers email data, along with the params to construct
   * and email and send it
   * 
   * @param {{to: string, subject: string, text: string, html?: string}} data Required data to send the email
   * 
   * @returns {void|object} Void, but if an error is thrown, its passed into the catch
   */
  public static async send (data: {to: string, subject: string, text: string, html?: string}): Promise<void|object> { 
      // Create a transporter
      const transporterOptions = {
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: mail.email,
          pass: mail.pass
        }
      }
      const transporter = nodemailer.createTransport(transporterOptions)

      // Send the email
      await transporter.sendMail({
        from: `"${mail.user}👻" <${mail.email}>`, // 'Edward <email address>
        to: data.to,
        subject: data.subject,
        text: data.text,
        html: data.html
      })
      // Get the response
      logger.debug('Send the email')
  }
}

function example () {
  const data: {
    to: string,
    subject: string,
    text: string,
    html: string
  } = {
    to: 'EdwardSBebbington@hotmail.com',
    subject: 'hello',
    text: 'hello world',
    html: '<b>hi</b>' // overwrites the text if present
  }
  MailHelper.send(data).catch((err) => {
    logger.error('Failed to send an email. Most likely because the password isnt set in the config')
  })
}

// // async..await is not allowed in global scope, must use a wrapper
// async function sendWithRealAcc(){

//   // create reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: 'Your email', // generated ethereal user
//       pass: 'Your password' // generated ethereal password
//     }
//   });

//   // send mail with defined transport object
//   let info = await transporter.sendMail({
//     from: '"Fred Foo 👻" <foo@example.com>', // sender address
//     to: "edward.bebbington@intercity.technology, baz@example.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>" // html body
//   });

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//   // Preview only available when sending through an Ethereal account
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
// }

// // async..await is not allowed in global scope, must use a wrapper
// async function sendWithTestAcc() {
//   // Generate test SMTP service account from ethereal.email
//   // Only needed if you don't have a real mail account for testing
//   let testAccount = await nodemailer.createTestAccount();

//   // create reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: testAccount.user, // generated ethereal user
//       pass: testAccount.pass // generated ethereal password
//     }
//   });

//   let info = await transporter.sendMail({
//     from: '"Fred Foo 👻" <foo@example.com>', // sender address
//     to: "edward.bebbington@intercity.technology, baz@example.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>" // html body
//   });

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//   // Preview only available when sending through an Ethereal account
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
// }

// sendWithTestAcc().catch(console.error);