const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '2025tech',
  database: 'users',
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

// Route to render the login/signup page
app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname + '/login.html'));
});

// Route to handle signup
app.post('/auth/signup', function (request, response) {
    let username = request.body.username;
    let email = request.body.email;
    let password = request.body.password;

    if (username && email && password) {
        connection.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password], function (error, results, fields) {
            if (error) {
                response.send('Error registering user');
                console.error(error);
            } else {
                response.redirect('/');
            }
        });
    } else {
        response.send('Please enter valid details!');
        response.end();
    }
});

// Route to handle login
app.post('/auth/login', function (request, response) {
    let username = request.body.username;
    let password = request.body.password;

    if (username && password) {
        connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
            if (error) throw error;

            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/home.html');
            } else {
                response.send('Incorrect Username and/or Password!');
            }
        });
    } else {
        response.send('Please enter valid details!');
        response.end();
    }
});

// Route for the home page
app.get('/home.html', function (request, response) {
    if (request.session.loggedin) {
        response.send('Logged in, ' + request.session.username + '!');
    } else {
        response.send('Please login to view this page!');
    }
    response.end();
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
