const puppeteer = require('puppeteer');

async function puppeteer_login_account(accountUsername, accountPassword) {

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
        userDataDir: "./tmp"
    });
    const page = await browser.newPage();
    await page.goto("https://trade.thinkorswim.com.sg/login");

    // login
    await page.waitForSelector("#username0");
    await page.type("#username0", accountUsername);
    await page.type("#password1", accountPassword);

    // accept
    await page.waitForSelector("[id='accept']");
    await page.click("[id='accept']");

    // wait for login page navigation
    await page.waitForSelector("[data-testid='exchange-status']");

    // check whether trading page is connected
    try {
        await page.waitForXPath('//*[contains(text(), "Connected")]', { timeout: 100 });
        return true
    } catch (error) {
        return false
    }
}

module.exports = {
    puppeteer_login_account
};
