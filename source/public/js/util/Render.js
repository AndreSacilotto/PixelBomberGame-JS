import Vector, { VectorZero } from "./Vector.js"
import ClientObjects from "./ClientObjects.js";

export default class RenderGame {
    
    /** @param {HTMLCanvasElement} canvas @param {string} localPlayerId @param {Vector} size */
    constructor(canvas, localPlayerId, size, obj = new ClientObjects()) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.playerId = localPlayerId;
        this.size = size;

        this.obj = obj;
        this.obj.playerId = localPlayerId;
    }

    /**@param {size} size*/
    set setSize(size){
        this.size = size;
        this.canvas.width = size.x;
        this.canvas.height = size.y;
    }

    renderAll() {
        this.clearRender();
        this.renderBombs();
        this.renderExplosion();
        this.renderPlayers();
        this.renderWall();
    }

    clearRender() {
        this.context.fillStyle = 'white';
        this.context.clearRect(0, 0, this.size.x, this.size.y);
    }

    renderPlayers() {
        for (const p of this.obj.players) {
            this.context.fillStyle = p.id === this.playerId ? "#F0DB4F" : 'gray';
            this.context.fillRect(p.position.x, p.position.y, 1, 1);
        }
    }

    renderBombs() {
        for (const b of this.obj.bombs) {
            this.context.fillStyle = 'orange';
            this.context.fillRect(b.position.x, b.position.y, 1, 1);
        }
    }

    renderExplosion() {
        for (const e of this.obj.explosions) {
            this.context.fillStyle = 'red';
            this.context.fillRect(e.position.x, e.position.y, 1, 1);
        }
    }

    renderWall() {
        for (const w of this.obj.walls) {
            this.context.fillStyle = 'black';
            this.context.fillRect(w.position.x, w.position.y, 1, 1);
        }
    }
}

class LocalPlayer {
    /** @param {string} id */
    /** @param {string} username */
    /** @param {Vector} position */
    constructor(id, username, position) {
        this.id = id;
        this.username = username;
        this.position = position;
    }
    setPosition(x, y) {
        this.position.set(x, y);
    }
}