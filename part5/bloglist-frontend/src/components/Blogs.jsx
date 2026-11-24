import { Link } from 'react-router-dom'

const Blogs = ({ blogs }) => {
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>blogs</h2>

      <ul>
        {sortedBlogs.map((blog) => (
          <li key={blog.id} className="blog">
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Blogs
