// import "mocha";
//
// import chai from "chai";
// const expect = chai.expect;
//
// import MailHelper from "../../helpers/MailHelper";
//
// chai.should();
//
// describe("MailHelper", () => {
//   describe("Methods", () => {
//     describe("send()", () => {
//       it("It should send an email  without html", async function () {
//         this.timeout(20000); // can take 9000-11000 ms
//         const data = {
//           to: "edwardsbbbington@hotmail.com", // This is wrong, but the email will still try send, if we check our sent emails, well notice it tried sending but address doesnt exist
//           subject: "Test email",
//           text: "Gday sir",
//         };
//         const info = await MailHelper.send(data);
//         expect(info).to.exist;
//         expect(info.messageId).to.exist;
//         expect(info.response.includes("OK")).to.equal(true);
//       });
//       it("Should send an email with html", async function () {
//         this.timeout(20000); // can take 9000-11000 ms
//         const data = {
//           to: "edwardsbbbington@hotmail.com", // This is wrong, but the email will still try send, if we check our sent emails, well notice it tried sending but address doesnt exist
//           subject: "Test email",
//           text: "Gday sir",
//           html: "<b>hello</b>",
//         };
//         const info = await MailHelper.send(data);
//         expect(info).to.exist;
//         expect(info.messageId).to.exist;
//         expect(info.response.includes("OK")).to.equal(true);
//       });
//     });
//   });
// });
