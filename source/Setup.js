import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import moment from 'moment';

import path from 'path';
import { fileURLToPath } from 'url';

// ------------ SERVER VARS ------------

const app = express();

export const server = http.createServer(app);
export const io = socketio(server);

// ------------ SERVER CREATION ------------

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`> Server listening on port: ${port} at ${moment().format("HH[:]mm[:]ss")}`)
})

// ------------ ROUTING ------------

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static("source/public"));
// app.use(express.static('source/public', {index: "html/login.html"}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/html/login.html'));
})

app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/html/game.html'));
})

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/html/admin.html'));
})

app.use((req, res) => {
    res.status(404).send("Error 404 - Page don't exist");
});
