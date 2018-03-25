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
    const app = express();

    function doWork(duration) {
        const start = Date.now();
        while (Date.now() - start < duration) {}
    }

    app.get('/', (req, res) => {
        doWork(5000);
        res.send(`Hello from worker ${process.pid}`);
    });

    app.get('/fast', (req, res) => {
        res.send(`This is fast from worker ${process.pid}`);
    });

    app.listen(3000);

    console.log(`Worker ${process.pid} started`);
}