const winston = require("winston");

const logger = winston.createLogger({
  level: "info", // You can set the desired log level
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(), // Output to console
    new winston.transports.File({ filename: "error.log", level: "error" }), // Log errors to a file
    new winston.transports.File({ filename: "combined.log" }), // Log all levels to another file
  ],
});

module.exports = logger;
