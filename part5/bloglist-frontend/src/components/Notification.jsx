import { Alert } from '@mui/material'

const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  return (
    <Alert
      severity={notification.type}
      style={{ marginTop: 10, marginBottom: 10 }}
    >
      {notification.message}
    </Alert>
  )
}

export default Notification
