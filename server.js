
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');


dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json()); 
app.use(cors());
app.use(morgan('dev')); 


app.get('/', (req, res) => {
    res.json({ message: 'tesing work' });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
