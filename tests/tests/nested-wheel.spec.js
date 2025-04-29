const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Nested Wheels', () => {
    beforeEach(async ({ page, request }) => {
        await page.goto('http://localhost:3000')

        await page.getByText("Add Entry").click()
        await page.getByText("Add Entry").click()
    }) 

    test('Can add a nested wheel', async ({ page }) => {
        await page.getByTestId("entry__input").first().fill("testEntry")
        await page.getByTestId("entry_testEntry_open").click()
        await page.getByTestId("confirm").click()
        await expect(page.getByTestId("entry_testEntry_input")).not.toBeVisible()
    }) 

    test('Can delete a nested wheel', async ({ page }) => {
        await page.getByTestId("entry__input").first().fill("testEntry")
        await page.getByTestId("entry_testEntry_open").click()
        await page.getByTestId("confirm").click()

        await page.getByTestId("go_back").click()
        await page.getByTestId("entry_testEntry_remove").click()
        await page.getByTestId("confirm").click()

        await expect(page.getByTestId("entry_testEntry_input")).not.toBeVisible()
    }) 

    test('Continues spinning to the next wheel', async ({ page }) => {
        await page.getByTestId("entry__input").first().fill("testEntry")
        await page.getByTestId("entry__input").fill("testEntry")

        await page.getByTestId("entry_testEntry_open").first().click()
        await page.getByTestId("confirm").click()
        await page.getByText("Add Entry").click()
        await page.getByText("Add Entry").click()
        await page.getByTestId("entry__input").first().fill("testNestedEntry")
        await page.getByTestId("entry__input").fill("testNestedEntry")
        await page.getByTestId("go_back").click()

        await page.getByTestId("entry_testEntry_open").last().click()
        await page.getByTestId("confirm").click()
        await page.getByText("Add Entry").click()
        await page.getByText("Add Entry").click()
        await page.getByTestId("entry__input").first().fill("testNestedEntry")
        await page.getByTestId("entry__input").fill("testNestedEntry")
        await page.getByTestId("go_back").click()

        const wheel = page.getByTestId('wheel')
        const box = await wheel.boundingBox()
        if (box) {
          const clickX = box.x + 100
          const clickY = box.y + 100
          await page.mouse.click(clickX, clickY)
        }
        await expect(page.getByTestId("selected_entries")).toContainText("testEntry", { timeout: 20000 })
        await expect(page.getByTestId("selected_entries")).toContainText("testNestedEntry")
    }) 
})