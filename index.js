// index.js
// where your node app starts

// init project
var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// // your first API endpoint...
// app.get("/api/hello", function (req, res) {
//   res.json({ greeting: "hello API" });
// });

// // Timestamp Microservice api endpoint Exercise 1
// app.get("/api/:date?", function (req, res) {
//   let dateString = req.params.date;
//   let date = new Date(dateString);

//   // If no date is provided, use current date
//   if (!dateString) {
//     date = new Date();
//   }
//   // If invalid date string, return error
//   if (date.toString() === "Invalid Date" && !/^\d+$/.test(dateString)) {
//     return res.json({ error: "Invalid Date" });
//   }

//   if (date.toString() === "Invalid Date") {
//     date = new Date(parseInt(dateString));
//   }
//   res.json({ unix: date.getTime(), utc: date.toUTCString() });
// });

// // User System infos api endpoint Exercise 2
// app.get("/api/:user?", function (req, res) {
//   let user = req.params.user;
//   let userInfo = {
//     ipaddress: req.ip,
//     language: req.headers["accept-language"],
//     software: req.headers["user-agent"]
//   }
//   if (!user) {
//     return res.json({ error: "User not passed"});
//   }
//   res.json(userInfo);

// });


// Exercise 3
// URL Shortener Microservice api endpoint Exercise 3
// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Use an in-memory database to persist URLs between requests while the server is running
let urlDatabase = [];
let urlId = 1;

const validUrl = (url) => {
  try {
    // Will throw if url is invalid
    let u = new URL(url);
    // Only allow http and https protocols
    return u.protocol === "http:" || u.protocol === "https:";
  } catch (e) {
    return false;
  }
};

app.post("/api/shorturl", function (req, res) {
  const original_url = req.body.url;

  if (!validUrl(original_url)) {
    return res.json({ error: "Invalid URL" });
  }

  // Check if url already exists in db
  let found = urlDatabase.find(item => item.original_url === original_url);

  if (found) {
    return res.json({ original_url: found.original_url, short_url: found.short_url });
  }

  // Assign new id and store
  let short_url = urlId++;
  urlDatabase.push({ original_url, short_url });

  res.json({ original_url, short_url });
});

// Redirect to original URL
app.get("/api/shorturl/:short_url", function (req, res) {
  const inputId = Number(req.params.short_url);

  const found = urlDatabase.find(item => item.short_url === inputId);

  if (!found) {
    return res.json({ error: "No short URL found for the given input" });
  }

  res.redirect(found.original_url);
});



// app.get("/api/shorturl/3:url", function(req, res) {
//   let link = req.params.url

//   // Check if valid URL like http(s)://www.example.com
//   if (!link) {
//     return res.json({ error: "No short URL found for the given input" });
//   }

//   res.json({ original_url: link, shorturl: 1});
// });


// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
