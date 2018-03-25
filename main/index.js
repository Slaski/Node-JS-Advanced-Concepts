process.env.UV_THREADPOOL_SIZE = 1;

const cluster = require('cluster');

// Is the file being executed in master mode?
if (cluster.isMaster) {
    // Cause index.js to be executed again but in child mode
    console.log(`Master ${process.pid} is running`)

    cluster.fork();
    cluster.fork();
    cluster.fork();
    cluster.fork();

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    })
} else {
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

    console.log(`Worker ${process.pid} started`);
}