import Input from "./util/Inputs.js"
import GameRender from "./util/Render.js"
import Vector from "./util/Vector.js"
import ClientObjects from "./util/ClientObjects.js";

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
var items;

socket.emit("startMatch");

// ---------- Inputs ----------
const inp = new Input();

inp.addInput('up', "w", "ArrowUp", () => moveY(-1));
inp.addInput('down', "s", "ArrowDown", () => moveY(1));
inp.addInput('right', "d", "ArrowRight", () => moveX(1));
inp.addInput('left', "a", "ArrowLeft",() => moveX(-1));
inp.addInput('bomb', "j", "z", () => placeBomb());
inp.addInput('wall', "k", "x", () => null);

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

// ---------- Game Events (Received) ----------

socket.on("console", (log) => console.log(log));

socket.on("message", (msg) => console.log(msg));

socket.on('connect', () => {
    render = new GameRender(canvas, socket.id);
    items = render.obj;
    console.log(`> You connected: ${socket.id} as ${username}`);
    socket.emit("username", username);
})

socket.on("kick", () => exit("kick"));
socket.on("disconnect", () => exit("disconnect"));

socket.on('setup', (packet, arena) => {
    render.setSize = arena;
    items.setAll(packet.players, packet.bombs, packet.explosions, packet.walls);
    render.renderAll();
})
    
socket.on('setPlayers', (players) => {    
    items.setPlayers = players;
    render.renderAll();
})

socket.on('setBombs', (bombs) => {
    items.bombs = bombs;
    render.renderAll();
})

socket.on('setExplosions', (explosions) => {
    items.explosions = explosions;
    render.renderAll();
})

socket.on('setWalls', (walls) => {
    items.walls = walls;
    render.renderAll();
})

socket.on('moveX', (id, x) => {
    items.players.find(t => t.id === id).position.x = x;
    render.renderAll();
})

socket.on('moveY', (id, y) => {
    items.players.find(t => t.id === id).position.y = y;
    render.renderAll();
})

// ---------- Game Events (Send) ----------

function moveX(dirX){
    socket.emit("moveX", dirX);
}
function moveY(dirY){
    socket.emit("moveY", dirY);
}

function placeBomb(){
    socket.emit("placeBomb");    
}

function createWall(){
    socket.emit("newWall");  
}