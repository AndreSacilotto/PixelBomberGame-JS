import Player from "./Player.js";
import Bomb from "./Bomb.js";
import Vector from "../public/js/util/Vector.js";
import Wall from "./Wall.js";

export default class ServerObjects {

    /**@param {Vector} arena 
     * @param {Player[]} players @param {Bomb[]} bombs 
     * @param {Wall[]} walls @param {Vector[]} explosions */
    constructor(arena, players = [], bombs = [], walls = [], explosions = []) {
        this.players = players;
        this.bombs = bombs;
        this.walls = walls;
        this.explosions = explosions;

        this.arena = arena;
    }

    reset() {
        for (const p of this.players)
            p.reset();
        this.bombs = [];
        this.walls = [];
        this.explosions = [];
    }

    addPlayer(player) {
        this.players.push(player);
    }
    addBomb(bomb) {
        this.bombs.push(bomb);
    }
    addExplosion(explosion) {
        this.explosions.push(explosion);
    }
    addExplosionArray(explosion = []) {
        this.explosions = this.explosions.concat(explosion);
    }
    addWall(wall) {
        this.walls.push(wall);
    }

    removePlayer(player) {
        arrayRemove(this.players, player);
    }
    removeBomb(bomb) {
        arrayRemove(this.bombs, bomb);
    }
    removeExplosion(explosion) {
        arrayRemove(this.explosions, explosion);
    }
    removeExplosionArray(explosion = []) {
        arrayRemoveArray(this.explosions, explosion);
    }
    removeWall(wall) {
        arrayRemove(this.walls, wall);
    }

    get setupPacket() {
        let packet = {
            players: this.packetPlayers,
            bombs: this.packetBombs,
            explosions: this.packetExplosions,
            walls: this.packetWalls,
        };
        return packet;
    }

    get packetPlayers() {
        let packet = [];
        for (const el of this.players)
            if (el.alive)
                packet.push({ id: el.id, position: el.position });
        return packet;
    }
    get packetBombs() {
        let packet = [];
        for (const el of this.bombs)
            packet.push({ position: el.position });
        return packet;
    }
    get packetExplosions() {
        let packet = [];
        for (const el of this.explosions)
            packet.push({ position: el });
        return packet;
    }
    get packetWalls() {
        let packet = [];
        for (const el of this.walls)
            packet.push({ position: el.position });
        return packet;
    }
}

/** @param {any[]} array @param {any} element */
export function arrayRemove(array, element) {
    const index = array.indexOf(element);
    if (index > -1)
        array.splice(index, 1);
}

/** @param {any[]} array @param {any[]} elements */
export function arrayRemoveArray(array, elements) {
    for (const el of elements) {
        arrayRemove(array, el)
    }
}