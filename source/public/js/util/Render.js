import Vector, { VectorZero } from "./Vector.js"
import ClientObjects from "./ClientObjects.js";

export default class RenderGame {
    
    /** @param {HTMLCanvasElement} canvas @param {ClientObjects} itens*/
    constructor(canvas, itens, size = VectorZero()) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.canvasSize = size;

        this.itens = itens;
    }

    /**@param {{x: number, y: number}} size*/
    set setSize(size){
        this.canvasSize.setByObject(size);
        this.canvas.width = size.x;
        this.canvas.height = size.y;
    }

    renderAll() {
        this.clearRender();
        this.renderBombs();
        this.renderExplosion();
        this.renderWall();
        this.renderPlayers();
    }

    clearRender() {
        this.context.fillStyle = 'white';
        this.context.clearRect(0, 0, this.canvasSize.x, this.canvasSize.y);
    }

    renderPlayers() {
        for (const p of this.itens.players) {
            this.context.fillStyle = 'gray';
            this.context.fillRect(p.position.x, p.position.y, 1, 1);
        }
        this.renderLocalPlayer();
    }
    
    renderLocalPlayer(){
        if (this.itens.localPlayer){
            this.context.fillStyle = "#F0DB4F";
            this.context.fillRect(this.itens.localPlayer.position.x, this.itens.localPlayer.position.y, 1, 1);
        }
    }

    renderBombs() {
        for (const b of this.itens.bombs) {
            this.context.fillStyle = 'orange';
            this.context.fillRect(b.position.x, b.position.y, 1, 1);
        }
    }

    renderExplosion() {
        for (const e of this.itens.explosions) {
            this.context.fillStyle = 'red';
            this.context.fillRect(e.position.x, e.position.y, 1, 1);
        }
    }

    renderWall() {
        for (const w of this.itens.walls) {
            this.context.fillStyle = 'black';
            this.context.fillRect(w.position.x, w.position.y, 1, 1);
        }
    }
}