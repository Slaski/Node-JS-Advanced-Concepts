// I'm a child, I'm going to act like a server and do nothing else
const express = require('express');
const crypto = require('crypto');
const app = express();

app.get('/', (req, res) => {
    crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
        res.send(`Hello from worker ${process.pid}`);
    });        
});

app.get('/fast', (req, res) => {
    res.send(`This is fast from worker ${process.pid}`);
});

app.listen(3000);