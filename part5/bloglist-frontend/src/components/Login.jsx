import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { TextField, Button } from '@mui/material'

const Login = ({ setUser, notify }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedInBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch (error) {
      notify('wrong username or password', 'error')
      console.log(error)
    }
  }

  return (
    <div>
      <h2>Log in to application</h2>

      <form onSubmit={handleLogin}>
        <div>
          <TextField
            variant="standard"
            label="username"
            onChange={(event) => setUsername(event.target.value)}
            value={username}
          />
        </div>
        <div>
          <TextField
            variant="standard"
            label="password"
            onChange={(event) => setPassword(event.target.value)}
            value={password}
          ></TextField>
        </div>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
          login
        </Button>
      </form>
    </div>
  )
}

export default Login
