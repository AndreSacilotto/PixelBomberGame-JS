import ClientObjects from "./util/ClientObjects.js";

import Input from "./util/Inputs.js"
import GameRender from "./util/Render.js"
import Vector from "./util/Vector.js"

// ---------- Local Vars and Events ----------
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('name');

console.log(new Date());
const socket = io();

var timerID;
var time = 0;

const canvas = document.getElementById("screen");
/** @type {GameRender} */
var render;
/** @type {ClientObjects} */
var itens;

// ---------- Inputs ----------
const inp = new Input();

inp.addInput('up', "w", "ArrowUp", () => moveY(-1));
inp.addInput('down', "s", "ArrowDown", () => moveY(1));
inp.addInput('right', "d", "ArrowRight", () => moveX(1));
inp.addInput('left', "a", "ArrowLeft",() => moveX(-1));
inp.addInput('bomb', "j", "z", () => placeBomb());
inp.addInput('wall', "k", "x", () => createWall());

// ---------- Operations ----------

function startGame(){
    time = 0;
    timerID = setInterval(() => time++, 1000)
}

function endGame(){
    console.log(time);
    clearInterval(timerID);
}

function exit(reason){
    console.log(reason);
    document.location.reload(true);
}

// ---------- Game Events (Send) ----------

function moveX(dirX){
    socket.emit("move", dirX, true);
}
function moveY(dirY){
    socket.emit("move", dirY, false);
}

function placeBomb(){
    socket.emit("placeBomb");    
}

function createWall(){
    socket.emit("createWall");  
}

// ---------- Game Events (Received) ----------

socket.on("console", (log) => console.log(log));

socket.on("message", (msg) => console.log(msg));

socket.on('connect', () => {
    itens = new ClientObjects(socket.id)
    render = new GameRender(canvas, itens);
    socket.emit("setName", username);    
    //DELETE THE LINE BELOW
    socket.emit("startMatch");    
})

socket.on("kick", () => exit("kick"));
socket.on("disconnect", () => exit("disconnect"));

socket.on('setup', (packet, arena) => {
    render.setSize = arena;
    itens.setAll(packet.players, packet.bombs, packet.explosions, packet.walls);
    render.renderAll();
})
    
socket.on('setPlayers', (players) => {    
    itens.setPlayers = players;
    render.renderAll();
})

socket.on('setBombs', (bombs) => {
    itens.bombs = bombs;
    render.renderAll();
})

socket.on('setExplosions', (explosions) => {
    itens.explosions = explosions;
    render.renderAll();
})

socket.on('setWalls', (walls) => {
    itens.walls = walls;
    render.renderAll();
})