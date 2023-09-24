const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const fs = require("fs");
const routes = require("./routes");
const session = require("express-session");

const app = express();

// Create a write stream for the log file
const accessLogStream = fs.createWriteStream(path.join("logs", "access.log"), {
  flags: "a",
});

// Session options
app.use(
  session({
    secret: "this-is-the-song-that-never-ends",
    resave: false, // Save session only if it has been modified
    saveUninitialized: false, // No session for unauthenticated
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(morgan("combined", { stream: accessLogStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

routes(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
