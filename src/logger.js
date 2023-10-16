const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

// Define the log format with timestamp and stack trace
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    if (stack) {
      // Include the stack trace if it exists
      return `${timestamp} [${level}] ${message}\n${stack}`;
    } else {
      return `${timestamp} [${level}] ${message}`;
    }
  })
);

// Create a transport for daily rotating log files
const dailyRotateTransport = new DailyRotateFile({
  filename: "application-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  dirname: "logs",
});

const logger = winston.createLogger({
  level: "info", // You can set the desired log level
  format: logFormat,
  transports: [
    // new winston.transports.Console(), // Output to console
    dailyRotateTransport,
  ],
});

module.exports = logger;
