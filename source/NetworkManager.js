import { io } from "./Setup.js"

import Player from "./util/Player.js";
import Bomb from "./util/Bomb.js";
import Wall from './util/Wall.js';

import Vector from "./public/js/util/Vector.js";
import ServerObjects from "./util/ServerObjects.js";

export const objects = new ServerObjects(new Vector(15, 15));

// NETWORK
export function messageBi(log){ 
    console.log(log);
    io.emit("message", log); 
}

export function message(log){ io.emit("message", log); }

export function setAll(){ io.emit("setup", objects.setupPacket, objects.arena); }

export function setPlayers(){ io.emit("setPlayers", objects.packetPlayers); }

export function setBombs(){ io.emit("setBombs", objects.packetBombs); }

export function setWalls(){ io.emit("setWalls", objects.packetWalls); }

export function setExplosions(){ io.emit("setExplosions", objects.packetExplosions); }

// CREATE FUNCS
export function createNewPlayer(socket)
{
    const player = new Player(socket.id);
    objects.addPlayer(player);
    socket.broadcast.emit("setPlayers", objects.packetPlayers);
    socket.emit("setup", objects.setupPacket, objects.arena);
    return player;
}

export function createPlayer(id, username){    
    const player = new Player(id, username);
    objects.addPlayer(player);
    setPlayers();
    return player;
}

export function createBomb(player, x, y, fire, radius)
{
    const bomb = new Bomb(player, new Vector(x, y), fire, radius);
    objects.addBomb(bomb);
    setBombs();
    return bomb;
}

export function createWall(x, y, destructible, moveable)
{
    const wall = new Wall(new Vector(x, y), destructible, moveable, 'black');
    objects.addWall(wall);
    setWalls();
    return wall;
}

export function createExplosion(area = [])
{
    objects.addExplosionArray(area);
    setExplosions();
}

// DELETE FUNCS

export function deletePlayer(player){    
    objects.removePlayer(player);
    setPlayers();
}

export function deleteBomb(bomb)
{
    objects.removeBomb(bomb);
    setBombs();
}

export function deleteWall(wall)
{
    objects.removeWall(wall);
    setWalls();
}

export function deleteExplosion(area = [])
{
    objects.removeExplosionArray(area);
    setExplosions();
}
