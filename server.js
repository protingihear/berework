const express = require('express');
const session = require('express-session');
const cors = require('cors');
const sequelize = require('./config/database');
const AuthRoutes = require('./routes/AuthRoutes');
const UserRoutes = require('./routes/UserRoutes');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, //ini cookie nya gua gangerti deh nanti mo di nyalain atau matiin
      maxAge: 1000 * 60 * 60 * 24, // 1 hari
    },
}));

app.use('/auth', AuthRoutes);
app.use('/api', UserRoutes);

sequelize.sync({ alter: true }).then(() => {
    console.log("database siap");
});

app.listen(5000, () => {
    console.log("port 5000");
});

