const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Wheels', () => {
    const fields = [
        {name: 'first_name', fill: 'testName'},
        {name: 'last_name', fill: 'testSurname'},
        {name: 'email', fill: 'testMail@gmail.com'},
        {name: 'password', fill: 'testPassword123'}
    ]

    beforeEach(async ({ page, request }) => {
        await request.delete('http://localhost:3001/api/wheel')
        await request.delete('http://localhost:3001/api/auth')

        await page.goto('http://localhost:4200')

        await page.evaluate(() => localStorage.clear())
        await page.getByText("Sign up").click()
        for (const field of fields) {
            await page.getByTestId(field.name).fill(field.fill)
        }
        await page.getByTestId("submit").click()
        await expect(page.getByText("Logout")).toBeVisible()
    }) 

    test('Can change wheel name', async ({ page }) => {
        await page.getByTestId("wheel_name_edit_button").click()
        await page.getByTestId("wheel_name_edit_input").fill("testWheel")
        await page.getByTestId("wheel_name_confirm").click()
        await expect(page.getByTestId("wheel_name")).toHaveText("testWheel")
    }) 

    test('Can create a new wheel', async ({ page }) => {
        await page.getByTestId("wheel_name_edit_button").click()
        await page.getByTestId("wheel_name_edit_input").fill("testWheel")
        await page.getByTestId("wheel_name_confirm").click()

        await page.getByTestId("open").click() 
        await page.getByTestId("wheel_create").click() 
        await page.getByTestId("confirm").click()
        await expect(page.getByTestId("wheel_name")).toHaveText("New Wheel")
    }) 

    test('Can save a wheel', async ({ page }) => {
        await page.getByTestId("save").click() 
        await expect(page.getByTestId("message")).toContainText("saved")

        await page.getByTestId("open").click() 
        await expect(page.getByTestId("open_wheels")).toContainText("New Wheel")
    }) 

    test('Can delete a wheel', async ({ page }) => {
        await page.getByTestId("save").click() 
        await expect(page.getByTestId("message")).toContainText("saved")
        await page.getByTestId("open").click() 
        await page.getByTestId("wheel_delete").first().click()
        await page.getByTestId("confirm").click()
        await expect(page.getByTestId("open_modal")).not.toContainText("New Wheel")
    }) 
})