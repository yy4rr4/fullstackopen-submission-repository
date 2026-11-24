import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import Blog from './Blog'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

const blogs = [
  {
    id: '123',
    title: 'Component testing is done with react-testing-library',
    author: 'Martin Fowler',
    url: 'https://martinfowler.com',
    likes: 10,
    user: {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
    },
  },
]

const renderBlog = ({
  user = null,
  handleLike = vi.fn(),
  handleRemove = vi.fn(),
} = {}) => {
  render(
    <MemoryRouter initialEntries={['/blogs/123']}>
      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blogs={blogs}
              handleLike={handleLike}
              handleRemove={handleRemove}
              user={user}
            />
          }
        />
      </Routes>
    </MemoryRouter>,
  )
}

test('displays blog info and likes to unauthenticated user, without buttons', () => {
  renderBlog({ user: null })

  expect(
    screen.getByText('Component testing is done with react-testing-library', {
      exact: false,
    }),
  ).toBeVisible()
  expect(screen.getByText('https://martinfowler.com')).toBeVisible()
  expect(screen.getByText('likes 10', { exact: false })).toBeVisible()

  expect(screen.queryByRole('button', { name: 'like' })).toBeNull()
  expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
})

test('displays blog info, likes, and action buttons to the logged-in creator', () => {
  const loggedInUser = {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
  }

  renderBlog({ user: loggedInUser })

  expect(screen.getByText('likes 10', { exact: false })).toBeVisible()
  expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
  expect(screen.getByRole('button', { name: 'remove' })).toBeVisible()
})

test('shows only the like button for authenticated non-creators', () => {
  const nonCreatorUser = {
    username: 'yyarra',
    name: 'Yaroslav',
  }

  renderBlog({ user: nonCreatorUser })

  expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
  expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
})

// test('URL and number of likes are rendered by default', () => {
//   const blog = {
//     title: 'Component testing is done with react-testing-library',
//     author: 'Martin Fowler',
//     url: 'https://martinfowler.com',
//     likes: 10,
//     user: {
//       username: 'mluukkai',
//       name: 'Matti Luukkainen',
//     },
//   }

//   render(<Blog blog={blog} />)

//   const titleAndAuthor = screen.getByText(
//     'Component testing is done with react-testing-library Martin Fowler',
//   )
//   expect(titleAndAuthor).toBeVisible()

//   const urlElement = screen.getByText('https://martinfowler.com')
//   expect(urlElement).not.toBeVisible()

//   const likesElement = screen.getByText('likes 10')
//   expect(likesElement).not.toBeVisible()
// })

// test('URL and number of likes are shown when the button controlling the shown details has been clicked', async () => {
//   const blog = {
//     title: 'Component testing is done with react-testing-library',
//     author: 'Martin Fowler',
//     url: 'https://martinfowler.com',
//     likes: 10,
//     user: {
//       username: 'mluukkai',
//       name: 'Matti Luukkainen',
//     },
//   }

//   render(<Blog blog={blog} />)

//   const user = userEvent.setup()
//   const button = screen.getByText('view')
//   await user.click(button)

//   const urlElement = screen.getByText('https://martinfowler.com')
//   expect(urlElement).toBeVisible()

//   const likesElement = screen.getByText('likes 10')
//   expect(likesElement).toBeVisible()
// })

// test('ensures that if the like button is clicked twice, the event handler the component received as props is called twice', async () => {
//   const blog = {
//     title: 'Component testing is done with react-testing-library',
//     author: 'Martin Fowler',
//     url: 'https://martinfowler.com',
//     likes: 10,
//     user: {
//       username: 'mluukkai',
//       name: 'Matti Luukkainen',
//     },
//   }

//   const mockHandler = vi.fn()

//   render(<Blog blog={blog} handleLike={mockHandler} />)

//   const user = userEvent.setup()
//   const viewButton = screen.getByText('view')
//   await user.click(viewButton)

//   const likeButton = screen.getByText('like')
//   await user.click(likeButton)
//   await user.click(likeButton)

//   expect(mockHandler.mock.calls).toHaveLength(2)
// })
