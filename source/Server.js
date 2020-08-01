import moment from 'moment';
import { io, server } from "./Setup.js"

import Player from "./util/Player.js";
import Vector from "./public/js/util/Vector.js";

import * as logic from "./GameLogic.js";
// ------------ SOCKETING ------------

server.on("close", () => console.log("Closing server"));

io.on('connection', (socket) => {

    const player = new Player(socket.id);
    logic.objects.addPlayer(player);

    socket.broadcast.emit("setPlayers", game.packetPlayer);
    socket.emit("setup", game.setupPacket, arenaSize);

    // DEFAULT EVENTS
    socket.on('disconnect', () => {
        console.log(`> Player disconnected: ${player.id} - ${player.username}`);
        game.removePlayer(player);
        io.emit("setPlayers", game.packetPlayer);
    })

    // ADM
    socket.on("console", (log) => console.log(log));

    socket.on("startMatch", () => {
        game.players.forEach(p => p.active());
        socket.emit("setup", game.setupPacket, arenaSize);
    })

    socket.on("endMatch", () => {
        game.Reset();
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

    socket.on('username', (name) => {
        if (name !== "") {
            player.username = name;
            const msg = `> Player connected: ${player.id} as ${player.username}`;
            console.log(msg);
            socket.broadcast.emit('message', msg);
        }
    })

    socket.on('moveX', (dirX) => {
        move(player, dirX, arenaSize.x, true);
        io.emit("moveX", player.id, player.position.x)
    })

    socket.on('moveY', (dirY) => {
        move(player, dirY, arenaSize.y, false);
        io.emit("moveY", player.id, player.position.y)
    })

    socket.on('placeBomb', () => placeBomb(player));

    socket.on('createWall', () => createWall(new Vector(player.position.x, player.position.y)));
})