const { shuffleArray } = require("./utils.js");

import { Builder, Capabilities, By } from "selenium-webdriver";

require("chromedriver");

const driver = new Builder().withCapabilities(Capabilities.chrome()).build();

beforeEach(async () => {
  driver.get("http://localhost:3000/");
});

afterAll(async () => {
  driver.quit();
});

let colors = ["pink", "blue", "red"];

test("shuffleArray should be an array", async () => {
  const theArray = shuffleArray(colors);
  expect(Array.isArray(theArray)).toBe(true);
});

test("shuffleArray should return an array the same length as received", async () => {
  const theArray = shuffleArray(colors);
  expect(colors.length).toBe(theArray.length);
});

test("shuffleArray should output the same items as it received", async () => {
  const theArray = shuffleArray(colors);
  let answer1 = colors.sort();
  let answer2 = theArray.sort();
  expect(answer1).toEqual(answer2);
});
