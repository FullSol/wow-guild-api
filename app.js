const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const fs = require("fs");
const session = require("express-session");
const rateLimit = require("express-rate-limit");
// Import the models
let { User, Profile } = require("./models");

// Import the services
const { UserService, ProfileService } = require("./services");

// Inject models into the services
const userService = new UserService(User);
const profileService = new ProfileService(Profile);

// Import the controllers
const { UserController, ProfileController } = require("./controllers/");

// Inject services into the controllers
const userController = new UserController(userService);
const profileController = new ProfileController(profileService);

// Import Routes
const profileApiRoutes = require("./routes/api/profileRoutes");
const userApiRoutes = require("./routes/api/userRoutes");
const userHTMLRoutes = require("./routes/html/userRoutes");

const app = express();

// Create a write stream for the log file
const accessLogStream = fs.createWriteStream(path.join("logs", "access.log"), {
  flags: "a",
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Session options
app.use(
  session({
    secret: "this-is-the-song-that-never-ends",
    resave: false, // Save session only if it has been modified
    saveUninitialized: false, // No session for unauthenticated
  })
);

app.use(morgan("combined", { stream: accessLogStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", limiter); // Apply to all routes under /api

// Mount the routes onto the app
app.use("/api/v1/users", userApiRoutes(userController));
app.use("/api/v1/profiles", profileApiRoutes(profileController));
app.use("/users", userHTMLRoutes(userController));

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
