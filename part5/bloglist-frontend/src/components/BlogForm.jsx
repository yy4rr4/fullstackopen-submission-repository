import { useState } from 'react'
import { TextField, Button } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleBlogCreation = async (event) => {
    event.preventDefault()

    createBlog({ title, author, url })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleBlogCreation}>
        <div>
          <TextField
            size="small"
            margin="dense"
            label="title"
            onChange={(event) => setTitle(event.target.value)}
            value={title}
          />
        </div>
        <div>
          <TextField
            size="small"
            margin="dense"
            label="author"
            onChange={(event) => setAuthor(event.target.value)}
            value={author}
          />
        </div>
        <div>
          <TextField
            size="small"
            margin="dense"
            label="url"
            onChange={(event) => setUrl(event.target.value)}
            value={url}
          />
        </div>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
          create
        </Button>
      </form>
    </div>
  )
}

export default BlogForm
