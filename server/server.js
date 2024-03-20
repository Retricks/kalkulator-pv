const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const { check, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
const testDatabaseConnection = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.query('SELECT 1');
    connection.release();
    console.log('Połączono z bazą danych.');
  } catch (error) {
    console.error('Błąd połączenia z bazą danych:', error.message);
  }
};

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
  secret: process.env.SESSION_SECRET,
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

// Endpoint obsługujący żądania logowania
app.post('/api/login', [
  check('username').notEmpty(),
  check('password').notEmpty(),
  validateInputs
], async (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ?';
  try {
    const [rows] = await pool.query(query, [username]);
    if (rows.length === 0) {
      return res.status(401).json({ isLoggedIn: false, error: 'Nieprawidłowa nazwa użytkownika lub hasło' });
    }

    const user = rows[0];
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ isLoggedIn: false, error: 'Nieprawidłowa nazwa użytkownika lub hasło' });
    }

    req.session.isLoggedIn = true;
    req.session.username = username;
    req.session.isPermissionAccess = user.permissions;
    res.json({ isLoggedIn: true, isPermissionAccess: user.permissions });
  } catch (error) {
    console.error('Błąd logowania:', error.message);
    res.status(500).json({ isLoggedIn: false, error: 'Wystąpił błąd podczas logowania' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Wylogowano pomyślnie' });
});

app.get('/api/checkSession', (req, res) => {
  const isLoggedIn = req.session.isLoggedIn || false;
  const username = req.session.username || '';
  const isPermissionsAccess = req.session.isPermissionsAccess || '';
  res.json({ isLoggedIn, username, isPermissionsAccess });
});

app.post('/api/register', [
  check('username').notEmpty(),
  check('password').notEmpty(),
  validateInputs
], async (req, res) => {
  const { username, password } = req.body;

  try {
    const [existingUser] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Użytkownik już istnieje' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = { username, password: hashedPassword };
    await pool.query('INSERT INTO users SET ?', newUser);

    res.status(200).json({ message: 'Rejestracja zakończona sukcesem' });
  } catch (error) {
    console.error('Błąd rejestracji:', error);
    res.status(500).json({ error: 'Błąd rejestracji' });
  }
});

app.post('/api/saveResults', [
  check('imieKlienta').notEmpty(),
  check('nazwiskoKlienta').notEmpty(),
  // Dodaj więcej walidacji dla pozostałych pól
  validateInputs
], (req, res) => {
  const { imieKlienta, nazwiskoKlienta, moduly, liczbaModulow, falowniki, magazyny, konstrukcje, koordynacja, montaz, rodzajKlienta, narzut, mocPV, pojemnoscME, sumaNetto, sumaVat, sumaBrutto, cenaBazowa, sumaNettoKlienta, sumaVatKlienta, sumaBruttoKlienta, zarobek } = req.body;

  const sql = 'INSERT INTO Oferty (ImieKlienta, NazwiskoKlienta, Moduly, LiczbaModulow, Falownik, Magazyn, Konstrukcja, Koordynacja, Montaz, RodzajKlienta, Narzut, MocPV, PojemnoscME, SumaNetto, SumaVAT, SumaBrutto, CenaBazowa, SumaNettoKlienta, SumaVatKlienta, SumaBruttoKlienta, Zarobek) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [imieKlienta, nazwiskoKlienta, JSON.parse(moduly).Model, liczbaModulow, JSON.parse(falowniki).Model, JSON.parse(magazyny)?.Model || null, JSON.parse(konstrukcje).Rodzaj, JSON.parse(koordynacja).Firma, JSON.parse(montaz).Firma, rodzajKlienta, narzut, mocPV, pojemnoscME, sumaNetto, sumaVat, sumaBrutto, cenaBazowa, sumaNettoKlienta, sumaVatKlienta, sumaBruttoKlienta, zarobek];

  pool.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error saving results:', err);
      return res.status(500).send('Error saving results to database');
    }
    console.log('Results saved successfully:', result);
    res.status(200).send('Results saved successfully');
  });
});

app.get('/api/data', async (req, res) => {
  try {
    const [moduly, falowniki, magazyny, konstrukcje, koordynacja, montaz, oferty] = await Promise.all([
      getData('Moduly'),
      getData('Falowniki'),
      getData('Magazyny'),
      getData('Konstrukcje'),
      getData('Koordynacja'),
      getData('Montaz'),
      getData('Oferty')
    ]);

    const data = {
      moduly,
      falowniki,
      magazyny,
      konstrukcje,
      koordynacja,
      montaz,
      oferty
    };
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

async function getData(tableName) {
  const [rows] = await pool.query(`SELECT * FROM ${tableName}`);
  return rows;
}

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await testDatabaseConnection();
});
