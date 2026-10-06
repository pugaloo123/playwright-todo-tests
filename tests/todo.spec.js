// @ts-check
import { test, expect } from '@playwright/test'


test.beforeEach(async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc/#/')
})


test('добавление одного дела', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?')
    await input.fill('Купить молоко')
    await input.press('Enter')

    const items = page.getByTestId('todo-title')
    await expect(items).toHaveText(['Купить молоко'])

});


test('Добавление двух дел', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?')
    await input.fill('Купить молоко')
    await input.press('Enter')



    await input.fill('Купить яйца')
    await input.press('Enter')

    const items = page.getByTestId('todo-title')
    await expect(items).toHaveText(['Купить молоко', 'Купить яйца'])
})


const cases = [
    { name: 'обычный текст', input: 'Купить молоко', expected: 'Купить молоко' },
    { name: 'пробел в начале', input: ' Купить молоко', expected: 'Купить молоко' },
    { name: 'пробел в конце', input: 'Купить молоко ', expected: 'Купить молоко' },
    { name: 'эмодзи', input: '😀', expected: '😀' },
    { name: 'символы', input: '%$', expected: '%$' },
    { name: 'пробелы внутри сохраняются', input: 'Купить    молоко', expected: 'Купить    молоко' },
    { name: 'HTML как текст', input: '<b>жирный</b>', expected: '<b>жирный</b>' }
]

test.describe('Корректный ввод', () => {
    for (const c of cases) {
        test(`добавление: ${c.name}`, async ({ page }) => {
            // ввод c.input, Enter, проверка, что в списке ровно [c.expected]
            const input = page.getByPlaceholder('What needs to be done?')
            await input.fill(c.input)
            await input.press('Enter')

            const items = page.getByTestId('todo-title')
            await expect(items).toHaveCount(1)
            expect(await items.first().textContent()).toBe(c.expected)


        })
    }

})


const casesForEmptyInput = [
    { name: 'пустая строк', input: '' },
    { name: 'только пробелы', input: '  ',},
]

test.describe('Пустой ввод', () => {
    for (const c of casesForEmptyInput) {
        test(`добавление: ${c.name}`, async ({ page }) => {
            const input = page.getByPlaceholder('What needs to be done?')
            await input.fill(c.input)
            await input.press('Enter')

            const items = page.getByTestId('todo-title')
            await expect(items).toHaveCount(0)

            // проверка, что вообще можно добавить дело
            await input.fill('Купить молоко')
            await input.press('Enter')
            
            await expect(items).toHaveText(['Купить молоко'])
        })
    }

})


test('Побочные эффекты добавления', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?')
    await input.fill('Молоко')
    await input.press('Enter')

    await expect(input).toHaveValue('')

    const todoCount = page.getByTestId('todo-count')
    await expect(todoCount).toHaveText('1 item left')

    await input.fill('Сладкое')
    await input.press('Enter')
    
    await expect(input).toHaveValue('')

    await expect(todoCount).toHaveText('2 items left')
})
