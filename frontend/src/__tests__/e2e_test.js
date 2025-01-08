const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

describe("E2E Test - Prédiction Iris", () => {
    let driver;

    beforeAll(async () => {
        const options = new chrome.Options();
        options.addArguments('--headless=new');
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
    }, 30000);

    afterAll(async () => {
        if (driver) {
            await driver.quit();
        }
    });

    it("Remplit le formulaire, soumet et affiche la prédiction", async () => {
        try {

            await driver.get("https://easy-dominica-adibon-6ea94c08.koyeb.app");

            await driver.findElement(By.name("sepal_length")).sendKeys("5.1");
            await driver.findElement(By.name("sepal_width")).sendKeys("3.5");
            await driver.findElement(By.name("petal_length")).sendKeys("1.4");
            await driver.findElement(By.name("petal_width")).sendKeys("0.2");

            await driver.findElement(By.css("button[type='submit']")).click();

            const predictionElement = await driver.wait(
                until.elementLocated(By.css("h2")),
                10000
            );

            const predictionText = await predictionElement.getText();
            expect(predictionText).toContain("Prédiction : Iris-setosa");
        } catch (error) {
            console.error('Test failed:', error);
            throw error;
        }
    }, 30000);
});