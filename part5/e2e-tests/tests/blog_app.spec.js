const { test, expect, beforeEach, describe } = require('@playwright/test')
const { login, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Yaroslav',
        username: 'yyarra',
        password: 'password',
      },
    })

    await page.goto('/login')
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await login(page, 'yyarra', 'password')

      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
      await expect(page).toHaveURL('/')
    })

    test('fails with wrong credentials', async ({ page }) => {
      await login(page, 'yyarra', 'wrong')

      await expect(
        page.getByRole('button', { name: 'logout' }),
      ).not.toBeVisible()
      await expect(page.getByText('Log in to application')).toBeVisible()
      await expect(page.locator('.notification.error')).toContainText(
        'wrong username or password',
      )
    })

    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await login(page, 'yyarra', 'password')
        await page.getByRole('button', { name: 'logout' }).waitFor()
        await page.getByRole('link', { name: 'new blog' }).click()
      })

      test('a new blog can be created', async ({ page }) => {
        await createBlog(
          page,
          'playwright testing',
          'playwright',
          'https://playwright.com',
        )

        await expect(
          await page.getByText(
            'a new blog playwright testing by playwright is added',
          ),
        ).toBeVisible()
        await expect(page).toHaveURL('/')
      })

      describe('When blog is created', () => {
        beforeEach(async ({ page }) => {
          await createBlog(
            page,
            'playwright testing',
            'playwright',
            'https://playwright.com',
          )

          await page
            .locator('.blog')
            .filter({ hasText: 'playwright testing' })
            .waitFor()

          await page
            .getByRole('link', {
              name: `${'playwright testing'}`,
            })
            .click()
        })

        test('it can be liked', async ({ page }) => {
          const blogContainer = page
            .getByText('playwright testing by playwright')
            .filter({ hasNotText: 'a new blog' })
            .locator('..')

          await expect(blogContainer.getByText('likes 0')).toBeVisible()
          await blogContainer.getByRole('button', { name: 'like' }).click()
          await expect(blogContainer.getByText('likes 1')).toBeVisible()
        })

        test('it can be deleted', async ({ page }) => {
          const blogContainer = page
            .getByText('playwright testing by playwright')
            .filter({ hasNotText: 'a new blog' })
            .locator('..')

          page.on('dialog', async (dialog) => {
            await dialog.accept()
          })

          await blogContainer.getByRole('button', { name: 'remove' }).click()

          await expect(blogContainer).not.toBeVisible()
        })

        // test("only the user who added the blog sees the blog's delete button", async ({
        //   page,
        //   request,
        // }) => {
        //   await request.post('/api/users', {
        //     data: {
        //       name: 'Matti Lukkainnen',
        //       username: 'mluukkai',
        //       password: 'password',
        //     },
        //   })

        //   const blogContainer = page
        //     .getByText('playwright testing by playwright')
        //     .filter({ hasNotText: 'a new blog' })
        //     .locator('..')

        //   await blogContainer.getByRole('button', { name: 'view' }).click()

        //   await expect(
        //     blogContainer.getByRole('button', { name: 'remove' }),
        //   ).toBeVisible()

        //   await page.getByRole('button', { name: 'logout' }).click()

        //   await login(page, 'mluukkai', 'password')

        //   await blogContainer.getByRole('button', { name: 'view' }).click()

        //   await expect(
        //     blogContainer.getByRole('button', { name: 'remove' }),
        //   ).not.toBeVisible()
        // })

        // test('blogs are arranged in the order according to the likes', async ({
        //   page,
        // }) => {
        //   await createBlog(
        //     page,
        //     'blog with 1 like',
        //     'Author 1',
        //     'https://playwright.com',
        //   )
        //   await createBlog(
        //     page,
        //     'blog with 2 likes',
        //     'Author 2',
        //     'https://playwright.com',
        //   )

        //   const blog1 = page
        //     .locator('.blog')
        //     .filter({ hasText: 'blog with 1 like' })
        //   const blog2 = page
        //     .locator('.blog')
        //     .filter({ hasText: 'blog with 2 likes' })

        //   await blog1.getByRole('button', { name: 'view' }).click()
        //   await blog1.getByRole('button', { name: 'like' }).click()
        //   await expect(blog1.getByText('likes 1')).toBeVisible()

        //   await blog2.getByRole('button', { name: 'view' }).click()
        //   await blog2.getByRole('button', { name: 'like' }).click()
        //   await expect(blog2.getByText('likes 1')).toBeVisible()
        //   await blog2.getByRole('button', { name: 'like' }).click()
        //   await expect(blog2.getByText('likes 2')).toBeVisible()

        //   const blogs = page.locator('.blog')

        //   await expect(blogs.nth(0)).toContainText('blog with 2 likes')
        //   await expect(blogs.nth(1)).toContainText('blog with 1 like')
        //   await expect(blogs.nth(2)).toContainText('playwright testing')
        // })
      })
    })
  })
})
