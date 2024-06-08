const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

let scoresDict = {};
let answersDict = {};

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to my simple Express server!");
});

// Endpoint to handle POST requests
app.post("/addAnswer", (req, res) => {
  const name = req.body.name;
  const answer = req.body.answer;

  if (!name || !answer) {
    return res.status(400).json({ error: "Name and answer are required." });
  }

  if (!(name in scoresDict)) {
    scoresDict[name] = 0;
  }

  answersDict[name] = answer;

  res.status(200).json({
    name: `${name}`,
    message: `${name} answered with ${answer}`,
  });
});

const transformAnswerRes = (answers) =>
  Object.keys(answers).map((key) => {
    return { name: key, answer: answers[key] };
  });

app.get("/getAnswers", (req, res) => {
  console.table(answersDict);
  res.status(200).json(transformAnswerRes(answersDict));
});

app.get("/clearAll", (req, res) => {
  scoresDict = {};
  answersDict = {};
  res.status(200).json({ message: "Cleared all." });
});

app.get("/clearAnswers", (req, res) => {
  answersDict = {};
  res.status(200).json({ message: "Cleared answers." });
});

app.post("/addScore", (req, res) => {
  const name = req.body.name;
  const scoreStr = req.body.score;

  if (!name || !scoreStr) {
    return res.status(400).json({ error: "Name and score are required." });
  }

  try {
    score = parseInt(scoreStr);
  } catch {
    return res.status(400).json({ error: "Score must be an integer" });
  }

  if (!(name in scoresDict)) {
    scoresDict[name] = 0;
  }

  scoresDict[name] += score;
  res.status(200).json({
    name: `${name}`,
    message: `Added score of ${scoreStr} to ${name}: ${scoresDict[name]}`,
  });
});

app.get("/checkScores", (req, res) => {
  console.table(scoresDict);
  res.status(200).json(scoresDict);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
