const express = require("express");
const app = express();
const path = require("path");
const createError = require("http-errors");
const fs = require("fs");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const rateLimit = require("express-rate-limit");
const passport = require("./src/config/passport");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const isProtected = require("./src/middlewares/isProtected");

// Proxy
const { createProxyMiddleware } = require("http-proxy-middleware");
const bnetProxy = createProxyMiddleware({
  target: "https://us.battle.net",
  changeOrigin: true,
  pathRewrite: {
    "^/auth/bnet": "/oauth", // Modify the path as needed
  },
});

// Environment Variables
const sessionSecret =
  process.env.SESSION_SECRET || "this_is_the_song_that_never_ends";

// Logging
const accessLogStream = fs.createWriteStream(path.join("logs", "access.log"), {
  flags: "a",
});

// Cors
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

// Cookie parser
app.use(cookieParser());

// Session
const sessionStore = new MySQLStore({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: null,
  database: "database_development",
});
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    store: sessionStore,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
    },
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use("/api", limiter);

// Passport
app.use(passport.initialize());

const apiRoutes = require("./src/routes/api")(passport);

// Logging
app.use(require("morgan")("combined", { stream: accessLogStream }));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Mount the routes onto the app
app.use("/api/v1", apiRoutes);

// bnet auth
const uniqueValue = Math.random().toString(36).substring(7);
app.get(
  "/auth/bnet",
  isProtected,
  passport.authenticate("bnet", { state: uniqueValue })
);

// bnet callback
app.get(
  "/auth/bnet/callback",
  isProtected,
  passport.authenticate("bnet", { failureRedirect: "/" }),
  function (req, res) {
    req.session.user = req.user;

    // Send a JSON response to the client
    res
      .status(200)
      .json({ success: true, message: "Authentication successful" });
  }
);

// 404 and error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
