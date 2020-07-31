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
    console.log(`> You ${username} connected on Client with id: ${socket.id}`);
    socket.emit("username", username);
})

socket.on("kick", () => exit("kick"));
socket.on("disconnect", () => exit("disconnect"));

socket.on('setup', (packet, arena) => {
    render.size.setByObject(arena);
    render.setObjects(packet.players, packet.bombs, packet.explosions, packet.walls);
    render.renderAll();
})

socket.on('addPlayer', (player) => {
    render.obj.addPlayer(player);
    render.renderAll();
})

socket.on('removePlayer', (id) => {    
    render.obj.removePlayer(render.obj.getPlayer(id));
    render.renderAll();
})

socket.on('updatePlayers', (state) => {
    console.log("updatePlayers");
    render.renderAll();
})

socket.on('moveX', (id, x) => {
    render.obj.getPlayer(id).position.x = x;
    render.renderAll();
})

socket.on('moveY', (id, y) => {
    render.obj.getPlayer(id).position.y = y;
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