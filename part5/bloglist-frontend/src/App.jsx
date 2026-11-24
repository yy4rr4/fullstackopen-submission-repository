import { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Login from './components/Login'
import Blogs from './components/Blogs'
import blogService from './services/blogs'
import Blog from './components/Blog'
import { AppBar, Container, Toolbar, Button } from '@mui/material'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    if (window.localStorage.getItem('loggedInBlogappUser')) {
      const user = JSON.parse(
        window.localStorage.getItem('loggedInBlogappUser'),
      )
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const notify = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)

      setBlogs(blogs.concat(returnedBlog))

      notify(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} is added`,
        'success',
      )
      navigate('/')
    } catch (error) {
      if (!user) {
        notify('please log in to application', 'error')
      }
      console.log(error)
    }
  }

  const removeBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author} ?`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter((b) => b.id !== blog.id))
        navigate('/')
      } catch (error) {
        console.log(error)
      }
    }
  }

  const addLike = async (blog) => {
    const updatedBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      const blogWithUser = { ...returnedBlog, user: blog.user }
      setBlogs(blogs.map((b) => (b.id !== blog.id ? b : blogWithUser)))
    } catch (error) {
      console.log(error)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInBlogappUser')
    blogService.setToken(null)
    setUser(null)
    navigate('/')
  }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            blogs
          </Button>
          <Button color="inherit" component={Link} to="create">
            new blog
          </Button>
          {user ? (
            <Button color="inherit" onClick={handleLogout}>
              logout
            </Button>
          ) : (
            <Button color="inherit" component={Link} to="login">
              login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Notification notification={notification} />

      <Routes>
        <Route
          path="/"
          element={<Blogs blogs={blogs} setBlogs={setBlogs} user={user} />}
        />
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blogs={blogs}
              handleLike={addLike}
              handleRemove={removeBlog}
              user={user}
            />
          }
        />
        <Route path="/create" element={<BlogForm createBlog={createBlog} />} />
        <Route
          path="/login"
          element={<Login setUser={setUser} notify={notify} />}
        />
      </Routes>
    </Container>
  )
}

export default App
