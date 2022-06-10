const express = require("express");
const path = require("path");
const app = express();
const { bots, playerRecord } = require("./data.js");
const { shuffleArray } = require("./utils.js");

// include and initialize the rollbar library with your access token
var Rollbar = require("rollbar");
var rollbar = new Rollbar({
  accessToken: "b764fbb31d6c47ada2c5cc500a2ba4ea",
  captureUncaught: true,
  captureUnhandledRejections: true,
});

// record a generic message and send it to Rollbar
rollbar.log("Hello world!");

app.use(express.json());
app.use(express.static("public"));

app.get("/api/robots", (req, res) => {
  rollbar.log("Someone tried to get all the robots!");
  try {
    res.status(200).send(botsArr);
  } catch (error) {
    rollbar.error("Someont tried and failed to get the robots.");
    console.log("ERROR GETTING BOTS", error);
    res.sendStatus(400);
  }
});

app.get("/api/robots/five", (req, res) => {
  try {
    rollbar.log("Someone got five random robots!");
    let shuffled = shuffleArray(bots);
    let choices = shuffled.slice(0, 5);
    let compDuo = shuffled.slice(6, 8);
    res.status(200).send({ choices, compDuo });
  } catch (error) {
    rollbar.error("They tried to get 5 robots, but it didn't work.");
    console.log("ERROR GETTING FIVE BOTS", error);
    res.sendStatus(400);
  }
});

app.post("/api/duel", (req, res) => {
  rollbar.log("Someone has dueled!");
  try {
    // getting the duos from the front end
    let { compDuo, playerDuo } = req.body;

    // adding up the computer player's total health and attack damage
    let compHealth = compDuo[0].health + compDuo[1].health;
    let compAttack =
      compDuo[0].attacks[0].damage +
      compDuo[0].attacks[1].damage +
      compDuo[1].attacks[0].damage +
      compDuo[1].attacks[1].damage;

    // adding up the player's total health and attack damage
    let playerHealth = playerDuo[0].health + playerDuo[1].health;
    let playerAttack =
      playerDuo[0].attacks[0].damage +
      playerDuo[0].attacks[1].damage +
      playerDuo[1].attacks[0].damage +
      playerDuo[1].attacks[1].damage;

    // calculating how much health is left after the attacks on each other
    let compHealthAfterAttack = compHealth - playerAttack;
    let playerHealthAfterAttack = playerHealth - compAttack;

    // comparing the total health to determine a winner
    if (compHealthAfterAttack > playerHealthAfterAttack) {
      rollbar.log("Poop muffins, the player lost.");
      playerRecord.losses++;
      res.status(200).send("You lost!");
    } else {
      rollbar.log("A player won!!");
      playerRecord.losses++;
      res.status(200).send("You won!");
    }
  } catch (error) {
    console.log("ERROR DUELING", error);
    res.sendStatus(400);
  }
});

app.get("/api/player", (req, res) => {
  try {
    res.status(200).send(playerRecord);
  } catch (error) {
    console.log("ERROR GETTING PLAYER STATS", error);
    res.sendStatus(400);
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
