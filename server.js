const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Read data from db.json
async function readData() {
  try {
    const data = await fs.readFile("db.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    return { distances: [] };
  }
}

// Write data to db.json
async function writeData(data) {
  await fs.writeFile("db.json", JSON.stringify(data, null, 2));
}

// Endpoint to receive distance data from ESP8266
app.post("/distance", async (req, res) => {
  const { distance } = req.body;
  const data = await readData();
  data.distances.push({ distance, timestamp: new Date().toISOString() });
  await writeData(data);
  res.sendStatus(200);
});

// Endpoint to get the latest distance
app.get("/latest-distance", async (req, res) => {
  const data = await readData();
  const latestDistance = data.distances[data.distances.length - 1] || {
    distance: null,
  };
  res.json(latestDistance);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
