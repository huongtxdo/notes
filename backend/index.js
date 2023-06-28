const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

// The role of index.js now is to launch the app at the specified port via app.listen
app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
