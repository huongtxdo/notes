const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return <div classname="error">{message}</div>
}

export default Notification
