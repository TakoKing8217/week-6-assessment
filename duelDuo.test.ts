import { Builder, Capabilities, By } from "selenium-webdriver";

require("chromedriver");

const driver = new Builder().withCapabilities(Capabilities.chrome()).build();

beforeEach(async () => {
  driver.get("http://localhost:3000/");
});

afterAll(async () => {
  driver.quit();
});

test("Title shows up when page loads", async () => {
  const title = await driver.findElement(By.id("title"));
  const displayed = await title.isDisplayed();
  expect(displayed).toBe(true);
});

test("Clicking Draw button dislays the options", async () => {
  const drawBtn = await driver.findElement(By.id("draw"));
  await driver.executeScript("arguments[0].click();", drawBtn);
  const choicesDisplayed = await driver.findElement(By.id("choices"));
  const displayed = await choicesDisplayed.isDisplayed();
  expect(displayed).toBe(true);
  await driver.sleep(2000);
});

test("Clicking `add to Duo` button displays player's duo", async () => {
  const addBotBtn = await driver.findElement(
    By.xpath('//*[text()="Add to Duo"]')
  );
  await driver.executeScript("arguments[0].click();", addBotBtn);
  const duoDisplayed = await driver.findElement(By.id("player-duo"));
  const displayed = await duoDisplayed.isDisplayed();
  expect(displayed).toBe(true);
  await driver.sleep(2000);
});
