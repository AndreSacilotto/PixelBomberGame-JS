import Vector, { VectorZero } from "./Vector.js"
import ClientObjects from "./ClientObjects.js";

export default class RenderGame {
    /** @param {HTMLCanvasElement} canvas */
    /** @param {string} localPlayerId */
    /** @param {Vector} size */
    constructor(canvas, localPlayerId, size = VectorZero()) {
        this.context = canvas.getContext('2d');
        this.playerId = localPlayerId;
        this.size = size;

        this.obj = new ClientObjects();
    }

    setObjects(players, bombs, explosions, walls) {
        this.obj.players = players;
        this.obj.bombs = bombs;
        this.obj.explosions = explosions;
        this.obj.walls = walls;
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
            this.context.fillStyle = 'black';
            if (p.id === this.playerId)
                this.context.fillStyle = '#F0DB4F';
            this.context.fillRect(p.position.x, p.position.y, 1, 1);
        }
    }

    renderBombs() {
        for (const b of this.obj.bombs) {
            this.context.fillStyle = 'green';
            this.context.fillRect(b.position.x, b.position.y, 1, 1);
        }
    }

    renderExplosion() {

    }

    renderWall() {

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