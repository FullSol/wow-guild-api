const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const fs = require("fs");
const session = require("express-session");
const rateLimit = require("express-rate-limit");
const passport = require("./src/config/passport");
const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, // Enable credentials
};
const apiRoutes = require("./src/routes/api");
const isProtected = require("./src/middlewares/isProtected");

const app = express();

// Create a write stream for the log file
const accessLogStream = fs.createWriteStream(path.join("logs", "access.log"), {
  flags: "a",
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

app.options("/api/v1/users/signin", cors(corsOptions));
app.options("/auth/bnet", cors(corsOptions));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Session options
app.use(
  session({
    secret: "this-is-the-song-that-never-ends",
    resave: false, // Save session only if it has been modified
    saveUninitialized: false, // No session for unauthenticated
    cookie: {
      httpOnly: true,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", limiter);
app.use(cors());

// Mount the routes onto the app
app.use("/api/v1", apiRoutes);

// bnet auth
const uniqueValue = Math.random().toString(36).substring(7);
app.get("/auth/bnet", passport.authenticate("bnet", { state: uniqueValue }));

// bnet callback
app.get(
  "/auth/bnet/callback",
  isProtected,
  passport.authenticate("bnet", { failureRedirect: "/" }),
  function (req, res) {
    res.redirect("http://localhost:3000/");
  }
);

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
