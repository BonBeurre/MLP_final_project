const puppeteer = require("puppeteer");

describe("E2E Test - Prédiction Iris", () => {
    it("Remplit le formulaire, soumet et affiche la prédiction", async () => {
        // Lancer un navigateur headless
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Naviguer vers l'application déployée
        await page.goto("https://easy-dominica-adibon-6ea94c08.koyeb.app");

        // Remplir les champs du formulaire
        await page.type('input[name="sepal_length"]', "5.1");
        await page.type('input[name="sepal_width"]', "3.5");
        await page.type('input[name="petal_length"]', "1.4");
        await page.type('input[name="petal_width"]', "0.2");

        // Soumettre le formulaire
        await page.click("button[type='submit']");

        // Attendre que la prédiction soit affichée
        await page.waitForSelector("h2");

        // Vérifier que la prédiction est correcte
        const predictionText = await page.$eval("h2", (el) => el.textContent);
        expect(predictionText).toContain("Prédiction : Iris-setosa");

        // Fermer le navigateur
        await browser.close();
    }, 30000); // Timeout de 30s pour les tests E2E
});
