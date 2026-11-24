import { useParams } from 'react-router-dom'
import {
  Card,
  CardContent,
  Paper,
  Typography,
  Link,
  Button,
  Stack,
} from '@mui/material'

const Blog = ({ blogs, handleLike, handleRemove, user }) => {
  const { id } = useParams()

  const blog = id ? blogs.find((blog) => blog.id === id) : null

  if (!blog) {
    return null
  }

  const canRemove = blog.user?.username === user?.username

  return (
    <Card variant="outlined" sx={{ mt: 2 }} className="blog">
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {blog.title}
        </Typography>

        <Typography color="textSecondary" sx={{ mb: 1 }}>
          by {blog.author}
        </Typography>
        <Typography sx={{ mb: 1 }}>
          <a href={blog.url}>{blog.url}</a>
        </Typography>
        <Typography sx={{ mb: 2 }} color="textSecondary">
          Added by {blog.user?.name}
        </Typography>
        <Stack alignItems="center" direction="row" spacing={1.5}>
          <Typography
            component="span"
            sx={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}
          >
            {blog.likes} likes
          </Typography>
          {user && (
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleLike(blog)}
            >
              like
            </Button>
          )}
          {canRemove && (
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => handleRemove(blog)}
            >
              remove
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default Blog
