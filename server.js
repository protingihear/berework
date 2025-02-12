const express = require('express');
const session = require('express-session');
const cors = require('cors');
const sequelize = require('./config/database');
const AuthRoutes = require('./routes/AuthRoutes');
const UserRoutes = require('./routes/UserRoutes');

const beritaRoutes = require("./routes/beritaRoutes");
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
    origin:  ['http://localhost:3000', 'https://berework-production.up.railway.app',"http://10.0.2.2:5000"]

}));

app.use(session({
    key: 'tt',
    secret: 'tt', // Replace with a strong secret key
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production' ? true : false, // Set to false for localhost
        httpOnly: true,
        sameSite: 'lax', // Allows cross-origin cookies in most cases
        maxAge: 1000 * 60 * 60 * 24 // 1 day

    }
}));
app.use('/auth', AuthRoutes);
app.use('/api', UserRoutes);
app.use("/api/berita", beritaRoutes);
//force buat hapus db
//alter buat alter
//kalo salah atibure atau apa harus di force dulu buat overwirte db nya atau edit sana nya
sequelize.sync({ alter: true }).then(() => {
    console.log("database siap");
});

app.listen(PORT, () => {
    console.log(`Server di port ${PORT}`);
});

