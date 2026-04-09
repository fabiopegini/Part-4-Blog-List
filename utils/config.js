require('dotenv').config()

const PORT = process.env.PORT || 3003
const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DBNAME = process.env.NODE_ENV === 'test' 
  ? process.env.MONGODB_DBNAME_TEST 
  : process.env.MONGODB_DBNAME

module.exports = { 
  MONGODB_URI, 
  MONGODB_DBNAME,
  PORT
}
