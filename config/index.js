require('dotenv').config();

const { APP_PORT, DEBUG_MODE, DB_URL, JWT_SECRET, REFRESH_SECRET} = process.env

 module.exports = {
     APP_PORT,
     DEBUG_MODE,
     DB_URL,
     JWT_SECRET,
     REFRESH_SECRET
 }