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

const arenaSize = new Vector(10, 10);

const game = new ServerObjects();

// ------------ SOCKETING ------------

io.on('connection', (socket) => {
    
    const player = new Player(socket.id);
    game.addPlayer(player);
    socket.broadcast.emit("addPlayer", game.makePacketPlayer(player));

    // DEFAULT EVENTS
    socket.on('disconnect', () => {
        console.log(`> Player disconnected: ${player.id} - ${player.username}`);
        io.emit("removePlayer", player.id);
        game.removePlayer(player);
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

    socket.emit("setup", game.setupPacket(), arenaSize);

    socket.on('username', (name) =>{
        if (name !== ""){
            player.username = name;
            const msg = `> Player connected: ${player.id} as ${player.username}`;
            console.log(msg);
            socket.broadcast.emit('message', msg);
        }
    })

    socket.on('moveX', (xdir) =>{        
        if(player.canAct()){
            player.position.x += xdir * player.stats.speed;
            if (xdir === 1 && player.position.x >= arenaSize.x)
                player.position.x = arenaSize.x;
            else if (xdir === -1 && player.position.x < 0)
                player.position.x = 0;
            io.emit("moveX", player.id, player.position.x);
        }
    })

    socket.on('moveY', (ydir) =>{
        console.log(player);
        if(player.canAct()){
            player.position.y += ydir * player.stats.speed;
            if (ydir === 1 && player.position.y >= arenaSize.y)
                player.position.y = arenaSize.y;
            else if (ydir === -1 && player.position.y < 0)
                player.position.y = 0;            
            io.emit("moveY", player.id, player.position.y);
        }
    })

    socket.on('placeBomb', () => placeBomb(player));

    socket.on('placeWall', () => null);
})

//setTimeout(() => io.emit('browserReload'), 2000);

// -------- REMOVES ---------

function removePlayer(player){
    arrayRemove(listPlayer, player);
}

function removeBomb(){
    arrayRemove(listBombs, player);
}

function removeWall(){
    arrayRemove(listWalls, player);
}

// --------- GAME FUNCS ---------

function updateGame(){
    const state = new State(listPlayer, listBombs, listWalls);
    io.emit("update", state);
}

function resetPlayers(){
    for (const pl of listPlayer)
        pl.Reset();
}

function killPlayer(playerDead, reason){
    playerDead.alive = false;
    const msg = `> ${playerDead.username} was killed by a ${reason}`
    console.log(msg);
    io.emit("kill", playerDead.id, msg);
}

/** @param {Player} player*/
function placeBomb(player){
    if(player.willPlaceBomb()){
        const bomb = new Bomb(player, new Vector(player.position.x, player.position.y), player.stats.fireRadius, player.stats.firePower);
        listBombs.push(bomb);
        setTimeout(() => bombExplosion(bomb), 2000);
    }
}

/** @param {Bomb} bomb*/
function bombExplosion(bomb)
{
    const area = bomb.bombArea();

    for (const p of listPlayer){
        for (let i = 0; i < area.length; i++) {
            if (hasPlayer(p, ps))
                killPlayer(p, `bomb of ${bomb.owner.username}`);
        }
    }
    arrayRemove(listBombs, bomb);
}

/** @param {Player} player @param {Vector} position */
function hasPlayer(player, position){
    return player.position.equalVector(position);
}