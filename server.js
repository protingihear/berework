const express = require('express');
const session = require('express-session');
const cors = require('cors');
const sequelize = require('./config/database');
const AuthRoutes = require('./routes/AuthRoutes');
const UserRoutes = require('./routes/UserRoutes');
const MySQLStore = require('express-mysql-session')(session);
const PORT = process.env.PORT || 5000;

require('dotenv').config();

const app = express();

const dbOptions = {
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'your_database'
};
const sessionStore = new MySQLStore(dbOptions);
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: '*'
}));

app.use(session({
    key: 'tt',
    secret: 'tt', // Ganti dengan secret key yang aman
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Hanya aktif di production jika pakai HTTPS
        maxAge: 1000 * 60 * 60 * 24 // 1 hari
    }
}));
app.use('/auth', AuthRoutes);
app.use('/api', UserRoutes);

sequelize.sync({ alter: true }).then(() => {
    console.log("database siap");
});

app.listen(PORT, () => {
    console.log(`Server di port ${PORT}`);
});

