const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

describe("E2E Test - Prédiction Iris", () => {
    let driver;

    beforeAll(async () => {
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(new chrome.Options().headless())
            .build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    it("Remplit le formulaire, soumet et affiche la prédiction", async () => {
        // Naviguer vers l'application déployée
        await driver.get("https://easy-dominica-adibon-6ea94c08.koyeb.app");

        // Remplir les champs du formulaire
        await driver.findElement(By.name("sepal_length")).sendKeys("5.1");
        await driver.findElement(By.name("sepal_width")).sendKeys("3.5");
        await driver.findElement(By.name("petal_length")).sendKeys("1.4");
        await driver.findElement(By.name("petal_width")).sendKeys("0.2");

        // Soumettre le formulaire
        await driver.findElement(By.css("button[type='submit']")).click();

        // Attendre que la prédiction soit affichée
        const predictionElement = await driver.wait(
            until.elementLocated(By.css("h2")),
            10000
        );

        // Vérifier la prédiction
        const predictionText = await predictionElement.getText();
        expect(predictionText).toContain("Prédiction : Iris-setosa");
    }, 30000);
});