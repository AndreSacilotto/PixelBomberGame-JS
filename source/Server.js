import moment from 'moment';
import { io, server } from "./Setup.js"

import Player from "./util/Player.js";

import * as logic from "./GameLogic.js";
import * as net from "./NetworkManager.js"

server.on("close", () => console.log("Closing server"));

const admPlayer = new Player("adm", "adm");

io.on('connection', (socket) => {

    // ----------- START AND DEFAULT EVENTS -----------
    const player = net.createNewPlayer(socket)

    socket.on('disconnect', () => {
        console.log(`> Player disconnected: ${player.id} as ${player.username} at ${moment.now()}`);
        net.deletePlayer(player);
    })

    socket.on('setName', (name) => {
        if (name)
             player.username = name;
        const msg = `> Player connected: ${player.id} as ${player.username} at ${moment.now()}`;
        net.messageBi(msg);
    })

    // ------------ ADM ------------
    socket.on("message", (log) => console.log(log));

    socket.on("startMatch", () => {
        logic.startMatch();
    })

    socket.on("endMatch", () => {
        logic.endMatch();
    })

    socket.on("admRevive", (id, x, y, reset) => {
        const p = net.objects.players.find(p => p.id == id);
        if (p){
            p.active();
            if (reset) p.reset();
            p.position.x = x;
            p.position.y = y;
            net.setPlayers();
        }
    })

    socket.on("admPlaceBomb", (x, y, power, radius) => {
        const bomb = net.createBomb(admPlayer, x, y, power, radius);
        logic.placeBomb(bomb);
    })

    socket.on("admPlaceWall", (x, y, des, move) => {
        net.createWall(x, y, des, move);
    })

    socket.on("kick", (id) => {
        io.emit("console", `Player ${id} as been kicked`)
        io.sockets.sockets[id].disconnect();
    })

    //------------ Player ------------

    socket.on('placeBomb', () => {
        if (player.canPlaceBomb) {
            const bomb = net.createBomb(player, player.position.x, player.position.y, player.stats.firePower, player.stats.fireRadius);
            logic.placeBomb(bomb);
        }
    })

    socket.on('createWall', () => {
        net.createWall(player.position.x, player.position.y, false, false);
    })

    socket.on("move", (dir, isX) => {
        logic.move(player, dir, isX);
        net.setPlayers();
    })
    
})