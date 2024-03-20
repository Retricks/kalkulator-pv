const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const { check, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 8080;

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'sql98.lh.pl',
  user: process.env.DB_USER || 'serwer198125',
  password: process.env.DB_PASSWORD || 'Baz@D@n7ch',
  database: process.env.DB_NAME || 'serwer198125_kalkulator',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const sessionStore = new MySQLStore({
  expiration: 86400000,
  createDatabaseTable: true,
}, pool);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", (req, res) => {
  res.send("Server is running.")
})


app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultSecretKey',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    secure: process.env.NODE_ENV === 'production', 
    httpOnly: true,
    maxAge: 86400000,
  },
}));

// Middleware do walidacji danych wejściowych
const validateInputs = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
