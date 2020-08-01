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

    /** @param {Vector} size @returns {Vector[]}*/
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

        //Bomb and Margins
        const outAreas = arr.filter(a => a.x < 0 || a.y < 0 || a.x >= size.x || a.y >= size.y).forEach(a => {
            if (a.x < 0)
                a.x += size.x;
            else if (a.x >= size.x)
                a.x -= size.x;

            if (a.y < 0)
                a.y += size.y;
            else if (a.y >= size.y)
                a.y -= size.y;
        });

        return arr;

    }

}