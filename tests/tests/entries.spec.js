const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Entries', () => {
    beforeEach(async ({ page, request }) => {
        await page.goto('http://localhost:3000')
    }) 

    test('Can add entry', async ({ page }) => {
        await page.getByText("Add Entry").click()
        await expect(page.getByTestId("entry__input").first()).toBeVisible()
    }) 

    describe("Customization", () => {
        beforeEach(async ({ page, request }) => {
            await page.getByText("Add Entry").click()
            await page.getByText("Add Entry").click()
        }) 

        test('Can change name', async ({ page }) => {
            await page.getByTestId("entry__input").first().fill("testEntry")
            await expect(page.getByTestId("segment_text").first()).toContainText("testEntry")
        }) 

        test('Can change color', async ({ page }) => {
            await page.getByTestId("entry__input").first().fill("testEntry")
            await page.getByTestId("entry_testEntry_properties").click()
            await page.getByTestId("entry_testEntry_properties_color").click()

            await expect(page.locator('color-sketch')).toBeVisible();
            await page.evaluate(() => {
                const comp = window['ng'].getComponent(document.querySelector('entry-properties'))
                comp.testSetColor('#ff0000')
            })

            const color = await page.getByTestId("segment").first().getAttribute('fill')
            expect(color).toContain('#ff0000');
        }) 

        test('Can change probability', async ({ page }) => {
            await page.getByTestId("entry__input").first().fill("testEntry")
            await page.getByTestId("entry_testEntry_properties").click()
            await page.getByTestId("entry_testEntry_properties_weight").fill("99")
            await expect(page.getByTestId("entry_testEntry_properties_probability")).toContainText("99%")
        }) 
    })
})