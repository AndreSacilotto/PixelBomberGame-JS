import { io } from "./Setup.js"

import Player from "./util/Player.js";
import Bomb from "./util/Bomb.js";

import ServerObjects from './util/ServerObjects.js';
import Vector from "./public/js/util/Vector.js";
import Wall from './util/Wall.js';

/** @type {SocketIO.Server} */
export var arenaSize = new Vector(15, 15);
export var objects = new ServerObjects();
export var bombTime = 5000;
export var explosionTime = 1000;

/** @param {Player} player */
export function move(player, dir, arenaAxis, isX) {
    if (player.canAct) {
        let movement, vector;
        if (isX) {
            movement = player.position.x + dir * player.stats.speed;
            vector = new Vector(movement, player.position.y);
        }
        else {
            movement = player.position.y + dir * player.stats.speed;
            vector = new Vector(player.position.x, movement);
        }

        //Verifica se Player
        //hasSomething(vector, game.players.map(t => t.position));

        //Collidir com Bomba
        if (hasSomething(vector, objects.walls.map(t => t.position)).bool) {
            return;
        }

        //Collidir com Wall
        if (hasSomething(vector, objects.bombs.map(t => t.position)).bool) {
            return;
        }

        //PowerUps
        // if (hasSomething(vector, game.bombs).bool){
        //     console.log("powerUp");
        //     return;
        // }

        // Verifica se Bordas
        if (movement >= arenaAxis)
            movement = 0;
        else if (movement < 0)
            movement = arenaAxis - 1;

        if (isX) player.position.x = movement;
        else player.position.y = movement;
    }
}

// --------- GAME FUNCS ---------

export function killPlayer(playerDead, reason) {
    playerDead.alive = false;
    const msg = `> ${playerDead.username} was killed by a ${reason}`;
    io.emit("setPlayers", objects.packetPlayer);
    io.emit("message", msg);
}

export function createWall(position, destructible = false, moveable = false) {
    const wall = new Wall(destructible, moveable, position);
    objects.addWall(wall);
    io.emit("setWalls", objects.packetWalls);
}

/** @param {Player} player*/
export function placeBomb(player) {
    if (player.willPlaceBomb()) {
        const bomb = new Bomb(player, new Vector(player.position.x, player.position.y), player.stats.firePower, player.stats.fireRadius);
        objects.addBomb(bomb);
        io.emit("setBombs", objects.packetBombs);
        setTimeout(() => bombExplosion(bomb), bombTime);
    }
}

/** @param {Bomb} bomb*/
export function bombExplosion(bomb) {
    const area = bomb.bombArea(arenaSize);
    objects.addExplosionArray(area);
    io.emit("setExplosions", objects.packetExplosions);
    setTimeout(() => endExplosion(area), explosionTime);

    for (const p of objects.players) {
        if (hasSomething(p.position, area).bool)
            killPlayer(p, `bomb of ${bomb.owner.username}`);
    }

    bomb.owner.usedBombs--;
    objects.removeBomb(bomb);
    io.emit("setBombs", objects.packetBombs);
}

/** @param {Vector[]} area*/
export function endExplosion(area) {
    objects.removeExplosionArray(area);
    io.emit("setExplosions", objects.packetExplosions);
}

/** @param {Vector} point @param {Vector[]} positions */
export function hasSomething(point, positions) {
    for (let i = 0; i < positions.length; i++) {
        if (point.equalVector(positions[i]))
            return { bool: true, index: i };
    }
    return { bool: false, index: -1 };
}