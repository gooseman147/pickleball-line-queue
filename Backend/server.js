const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let queue = []; // Simple in-memory queue

// Join the queue
app.post("/api/join", (req, res) => {
  const { name, partySize, skill, matchPref } = req.body;

  const player = {
    id: Date.now(),
    name,
    partySize,
    skill,
    matchPref,
    checkInTime: new Date(),
    status: "waiting",
  };

  queue.push(player);
  res.json({ message: "You have joined the queue!", position: queue.length });
});

// View raw queue list
app.get("/api/queue", (req, res) => {
  res.json(queue);
});

// Mark the first group as done (simple logic for now)
app.post("/api/game-done", (req, res) => {
  // 1. Move current 'playing' players to 'done'
  const currentlyPlaying = queue.filter((p) => p.status === "playing");
  if (currentlyPlaying.length > 0) {
    currentlyPlaying.forEach((p) => (p.status = "done"));
  }

  // 2. Promote the next 4 waiting players to 'playing'
  const waitingPlayers = queue.filter((p) => p.status === "waiting");
  const nextUp = waitingPlayers.slice(0, 4);
  nextUp.forEach((p) => (p.status = "playing"));

  if (nextUp.length === 0) {
    return res.json({ message: "No one waiting in queue.", nowPlaying: [] });
  }

  res.json({ message: "Next group promoted to playing.", nowPlaying: nextUp });
});

// View grouped queue (waiting, playing, done)
app.get("/api/queue/view", (req, res) => {
  const waiting = queue.filter((player) => player.status === "waiting");
  const playing = queue.filter((player) => player.status === "playing");
  const done = queue.filter((player) => player.status === "done");

  res.json({ waiting, playing, done });
});

app.listen(PORT, () => {
  console.log(
    `✅ Pickleball Line Queue backend running at http://localhost:${PORT}`
  );
});
