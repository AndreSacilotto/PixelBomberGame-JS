import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import moment from 'moment';

import path from 'path';
import { fileURLToPath } from 'url';

import Player from "./util/Player.js";
import Bomb from "./util/Bomb.js";
import Vector from "./public/js/util/Vector.js";
import ServerObjects from './util/ServerObjects.js';

// ------------ SERVER VARS ------------

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 3000;

// ------------ SERVER CREATION ------------

server.listen(port, () => {
    console.log(`> Server listening on port: ${port} at ${moment().format("HH[:]mm[:]ss")}`)
})
server.on("close", () => console.log("Closing server"));

// ------------ ROUTING ------------

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

// ------------ GAME VARS ------------

function arrayRemove(array = [], element) { 
    const index = array.indexOf(element);
    if (index > -1)
        array.splice(index, 1);
}

const arenaSize = new Vector(100, 100);

const game = new ServerObjects();

// ------------ SOCKETING ------------

io.on('connection', (socket) => {
    
    const player = new Player(socket.id);
    game.addPlayer(player);

    socket.broadcast.emit("setPlayers", game.packetPlayer());
    socket.emit("setup", game.setupPacket(), arenaSize);

    // DEFAULT EVENTS
    socket.on('disconnect', () => {
        console.log(`> Player disconnected: ${player.id} - ${player.username}`);
        game.removePlayer(player);
        io.emit("setPlayers", game.packetPlayer());
    })

    // ADM
    socket.on("console", (log) => console.log(log));

    socket.on("startMatch", () => {
        game.players.forEach(p => p.active());
    })

    socket.on("endMatch", () => {
    })

    socket.on("admRevive", (id, x, y) => {
    })

    socket.on("admPlaceBomb", (x, y, power, radius) => {
    })    

    socket.on("admPlaceWall", (x, y) => {
    }) 

    socket.on("kick", (id) => {
        io.emit("console", `Player ${id} as been kicked`)
        io.sockets.sockets[id].disconnect();
    })

    // GAME

    socket.on('username', (name) =>{
        if (name !== ""){
            player.username = name;
            const msg = `> Player connected: ${player.id} as ${player.username}`;
            console.log(msg);
            socket.broadcast.emit('message', msg);
        }
    })

    socket.on('moveX', (dirX) =>{             
        move(player, dirX, arenaSize.x, true);
        io.emit("moveX", player.id, player.position.x)
    })

    socket.on('moveY', (dirY) =>{       
        move(player, dirY, arenaSize.y, false);
        io.emit("moveY", player.id, player.position.y)
    })

    socket.on('placeBomb', () => placeBomb(player));

    socket.on('placeWall', () => null);
})

/** @param {Player} player */
function move(player, dir, arenaAxis, isX){
    if(player.canAct){
        let movement, vector;
        if (isX){
            movement = player.position.x + dir * player.stats.speed;
            vector = new Vector(movement, player.position.y);
        }
        else{
            movement = player.position.y + dir * player.stats.speed;
            vector = new Vector(player.position.x, movement);
        }

        //Verifica se Player
        //hasSomething(vector, game.players.map(t => t.position));
        
        //Verifica se Bomba e Wall existem
        if (hasSomething(vector, game.bombs).bool && hasSomething(vector, game.walls).bool)
            return;

        // Verifica se Bordas
        if (movement >= arenaAxis)
            movement = 0;
        else if (movement < 0)
            movement = arenaAxis-1;

        if (isX) player.position.x = movement;
        else player.position.y = movement;
    }
}

//setTimeout(() => io.emit('browserReload'), 2000);

// --------- GAME FUNCS ---------

function updateGame(){
    io.emit("setup", game.setupPacket(), arenaSize);
}

function resetPlayers(){
    for (const pl of listPlayer)
        pl.Reset();
}

function killPlayer(playerDead, reason){
    playerDead.alive = false;
    const msg = `> ${playerDead.username} was killed by a ${reason}`
    //console.log(msg);
    io.emit("kill", playerDead.id, msg);
}

/** @param {Player} player*/
function placeBomb(player){
    if(player.willPlaceBomb()){
        const bomb = new Bomb(player, new Vector(player.position.x, player.position.y), player.stats.fireRadius, player.stats.firePower);
        game.addBomb(bomb);
        setTimeout(() => bombExplosion(bomb), 2000);
    }
}

/** @param {Bomb} bomb*/
function bombExplosion(bomb){
    const area = bomb.bombArea();

    for (const p of game.players){
        if (hasSomething(p.position, area).bool)
            killPlayer(p, `bomb of ${bomb.owner.username}`);
    }
    game.removeBomb(bomb);
}

/** @param {Vector} point @param {Vector[]} positions */
function hasSomething(point, positions){
    for (let i = 0; i < positions.length; i++) {
        if (point.equalVector(positions[i]))
            return { bool: true, index: i};
    }
    return { bool: false, index: -1};
}
