module.exports = function (request, response, next) {
  const start = +new Date();
  const method = request.method;
  const url = request.url;
  const ip = request.connection.remoteAddress;
  const stream = process.stdout;

  response.on("finish", function () {
    const duration = +new Date() - start;
    const message =
      method + " to " + url + " took " + duration + "ms from " + ip + "\n\n";
    stream.write(message);
  });
  next();
};
