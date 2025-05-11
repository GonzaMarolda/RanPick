const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Auth', () => {
    beforeEach(async ({ page, request }) => {
        await request.delete('http://localhost:3000/api/auth')

        await page.goto('http://localhost:4200')
        await page.evaluate(() => localStorage.clear())
    }) 

    const fields = [
        {name: 'input_First Name', fill: 'testName'},
        {name: 'input_Last Name', fill: 'testSurname'},
        {name: 'input_Email', fill: 'testMail@gmail.com'},
        {name: 'input_Password', fill: 'testPassword123'}
    ]
    describe('Manual sign up', () => {
        test('Can sign up', async ({ page }) => {
            await page.getByText("Sign up").click()
            for (const field of fields) {
                await page.getByTestId(field.name).fill(field.fill)
            }
            await page.getByTestId("submit").click()

            await expect(page.getByText("Logout")).toBeVisible()
        }) 

        test('Error on empty fields', async ({ page }) => {
            await page.getByText("Sign up").click()
            await page.getByTestId("submit").click()
            for (const field of fields) {
                await expect(page.getByTestId(field.name)).toHaveClass(/invalid/)
            }
        }) 
    })

    describe('Manual log in', () => {
        test('Can log in', async ({ page }) => {
            await page.getByText("Sign up").click()
            for (const field of fields) {
                await page.getByTestId(field.name).fill(field.fill)
            }
            await page.getByTestId("submit").click()
    
            await page.getByText("Logout").click()

            await page.getByText("Log in").click()
            for (const field of fields.slice(fields.length - 2)) {
                await page.getByTestId(field.name).fill(field.fill)
            }
            await page.getByTestId("submit").click()
    
            await expect(page.getByText("Logout")).toBeVisible()
        }) 

        test('Error on empty fields', async ({ page }) => {
            await page.getByText("Log in").click()
            await page.getByTestId("submit").click()
            for (const field of fields.slice(fields.length - 2)) {
                await expect(page.getByTestId(field.name)).toHaveClass(/invalid/)
            }
        }) 

        test('Error on incorrect password', async ({ page }) => {
            await page.getByText("Sign up").click()
            for (const field of fields) {
                await page.getByTestId(field.name).fill(field.fill)
            }
            await page.getByTestId("submit").click()
    
            await page.getByText("Logout").click()

            await page.getByText("Log in").click()
            await page.getByTestId("input_Email").fill("testMail@gmail.com")
            await page.getByTestId("input_Password").fill("incorrectPassword")
            await page.getByTestId("submit").click()
            await expect(page.getByTestId("error_message")).toContainText("password")
        }) 

        test('Error on incorrect email', async ({ page }) => {
            await page.getByText("Sign up").click()
            for (const field of fields) {
                await page.getByTestId(field.name).fill(field.fill)
            }
            await page.getByTestId("submit").click()
    
            await page.getByText("Logout").click()

            await page.getByText("Log in").click()
            await page.getByTestId("input_Email").fill("incorrectMail@gmail.com")
            await page.getByTestId("input_Password").fill("testPassword123")
            await page.getByTestId("submit").click()
            await expect(page.getByTestId("error_message")).toContainText("password")
        }) 
    })
})