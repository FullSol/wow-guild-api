const isProtected = (req, res, next) => {
  console.log(req.session);
  // Check if the user is authenticated
  if (req.session.user) {
    // Proceed
    return next();
  } else {
    // Check if it's an API request
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      // Send JSON response for API requests
      res.status(401).json({ error: "Unauthorized: Please log in." });
    } else {
      // Set response headers [cors is annoying]
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
      res.setHeader("Access-Control-Allow-Credentials", "true");

      // Redirect to the sign-in page for other requests
      res.status(401).send("Unauthorized: Please log in.");
    }
  }
};

module.exports = isProtected;
