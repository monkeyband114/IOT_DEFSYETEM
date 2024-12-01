const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let latestDistance = null;

app.post("/distance", (req, res) => {
  latestDistance = parseInt(req.body.distance);
  console.log(`Received distance: ${latestDistance} cm`);
  res.sendStatus(200);
});

app.get("/latest-distance", (req, res) => {
  res.json({ distance: latestDistance });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
