import { io } from "./Setup.js"
import * as net from "./NetworkManager.js"

import Player from "./util/Player.js";
import Bomb from "./util/Bomb.js";

import Vector from "./public/js/util/Vector.js";
import Wall from './util/Wall.js';

const objects = net.objects;

export const bombTime = 2000;
export const explosionTime = 1000;

export function startMatch(){
    objects.reset();
    objects.players.forEach( p => p.active());
    net.setAll();
}

export function endMatch(){
    objects.reset();
    net.setAll();
}

/** @param {Player} player */
export function move(player, dir, isX) {
    if (player.canAct) {
        let movement, vector, arenaAxis;
        if (isX) {
            arenaAxis = objects.arena.x;
            movement = player.position.x + dir * player.stats.speed;
            vector = new Vector(movement, player.position.y);
        }
        else {
            arenaAxis = objects.arena.y;
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


// GAME FUNCTIONS

/** @param {Player} player*/
export function damagePlayer(player, damage, reason) {
    player.receiveDamage = damage;
    if (!player.alive){
        const msg = `> ${player.username} was killed by a ${reason}`;
        net.setPlayers();
        net.message(msg);
    }
}

/** @param {Bomb} bomb*/
export function placeBomb(bomb) {
    setTimeout(() => bombExplosion(bomb), bombTime);
}

/** @param {Bomb} bomb*/
export function bombExplosion(bomb) {
    const area = bomb.bombArea(objects.arena);
    net.createExplosion(area);
    
    for (const p of objects.players) {
        if (hasSomething(p.position, area).bool)
            damagePlayer(p, 1, `bomb of ${bomb.owner.username}`);
    }

    setTimeout(() => net.deleteExplosion(area), explosionTime);
    
    bomb.owner.usedBombs--;
    net.deleteBomb(bomb);
}

/** @param {Vector} point @param {Vector[]} positions */
export function hasSomething(point, positions) {
    for (let i = 0; i < positions.length; i++) {
        if (point.equalVector(positions[i]))
            return { bool: true, index: i };
    }
    return { bool: false, index: -1 };
}