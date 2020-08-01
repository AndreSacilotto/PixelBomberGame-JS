import Player from "./Player.js";
import Bomb from "./Bomb.js";
import Walls from "./Wall.js";
import Vector from "../public/js/util/Vector.js";

export default class ServerObjects{

    /** @param {Player[]} p @param {Bomb[]} b 
     * @param {Vector[]} w @param {Vector[]} e */
    constructor(p = [], b = [], w = [], e = []){
        this.players = p;
        this.bombs = b;
        this.walls = w;
        this.explosions = e;
    }

    addPlayer(player){
        this.players.push(player);
    }
    addBomb(bomb){
        this.bombs.push(bomb);
    }
    addExplosion(explosion){
        this.explosions.push(explosion);
    }
    addWall(wall){
        this.walls.push(wall);
    }    

    removePlayer(player){
        arrayRemove(this.players, player);
    }
    removeBomb(bomb){
        arrayRemove(this.bombs, bomb);
    }
    removeExplosion(explosion){
        arrayRemove(this.explosions, explosion);
    }
    removeWall(wall){
        arrayRemove(this.walls, wall);
    }

    setupPacket()
    {
        let packet = {
            players: this.packetPlayer(),
            bombs: this.packetBombs(),
            explosions: this.packetExplosions(),
            walls: this.packetWalls(),
        };
        return packet;
    }

    packetPlayer(){
        let packet = [];
        for (const el of this.players)
            packet.push({ id: el.id, position: el.position});   
        return packet; 
    }
    packetBombs(){
        let packet = [];
        for (const el of this.bombs)
            packet.push({ position: el.position});   
        return packet; 
    }
    packetExplosions(){
        let packet = [];
        for (const el of this.explosions)
            packet.push({ position: el.position});   
        return packet; 
    }
    packetWalls(){
        let packet = [];
        for (const el of this.walls)
            packet.push({ position: el.position});   
        return packet; 
    }
}

/** @param {any[]} array @param {any} element */
export function arrayRemove(array, element) { 
    const index = array.indexOf(element);
    if (index > -1)
        array.splice(index, 1);
}