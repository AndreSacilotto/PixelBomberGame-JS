import Vector from "../public/js/util/Vector.js";
import Player from "./Player.js";

export default class Bomb {
    /** @param {Player} bombOwner */
    constructor(bombOwner, pos = new Vector(), bombPower = 0, bombRadius = 0) {
        this.owner = bombOwner;
        this.position = pos;
        this.radius = bombRadius;
        this.power = bombPower;
    }

    /** @param {Vector} size */
    bombArea(size) {
        /** @type {Vector[]} arr */
        const arr = [];

        //Get Linha
        arr.push(new Vector(this.position.x, this.position.y));
        for (let i = 1; i <= this.power; i++) {
            arr.push(new Vector(this.position.x - i, this.position.y));
            arr.push(new Vector(this.position.x, this.position.y + i));
            arr.push(new Vector(this.position.x + i, this.position.y));
            arr.push(new Vector(this.position.x, this.position.y - i));
        }

        //Get Diagonais
        for (let x = 1, y = this.radius; y > 0; x++, y--) {
            for (let i = y; i > 0; i--) {
                arr.push(new Vector(this.position.x + x, this.position.y + i));
                arr.push(new Vector(this.position.x + x, this.position.y - i));
                arr.push(new Vector(this.position.x - x, this.position.y - i));
                arr.push(new Vector(this.position.x - x, this.position.y + i));
            }
        }

        //TODO make bombs pass the margins
        const outAreas = arr.filter(a => a.x < 0 || a.y < 0 || a.x >= size.x || a.y >= size.y);
        
        for (let i = 0; i < outAreas.length; i++) {
            if (outAreas[i].x < 0)
            outAreas[i].x += size.x;
            else if (outAreas[i].x >= size.x)
            outAreas[i].x -= size.x;
            
            if (outAreas[i].y < 0)
            outAreas[i].y += size.y;
            else if (outAreas[i].y >= size.y)
            outAreas[i].y -= size.y;
        }

        return arr;
        
    }

}