import Vector from "../public/js/util/Vector.js";
import Player from "./Player.js";

export default class Bomb{
    /** @param {Player} bombOwner */
    constructor(bombOwner, pos = new Vector(), bombPower = 0, bombRadius = 0){
        this.owner = bombOwner;
        this.position = pos;
        this.radius = bombRadius;
        this.power = bombPower;
    }

    bombArea(){
        /** @type {Vector[]} arr */
        const arr = [];

        //Get Linha
        arr.push(new Vector(this.position.x, this.position.y));
        for(let i = 1; i <= this.power; i++){
            arr.push(new Vector(this.position.x - i, this.position.y));
        	arr.push(new Vector(this.position.x, this.position.y + i));
        	arr.push(new Vector(this.position.x + i, this.position.y));
            arr.push(new Vector(this.position.x, this.position.y - i));
        }

        //Get Diagonais

        for(let x = 1, y = this.radius; y > 0; x++, y--)
        {
            for(let i = y; i > 0; i--)
            {
                arr.push(new Vector(this.position.x + x, this.position.y + i));
                arr.push(new Vector(this.position.x + x, this.position.y - i));
                arr.push(new Vector(this.position.x - x, this.position.y - i));
                arr.push(new Vector(this.position.x - x, this.position.y + i));
            }
        }

        return arr;
    }

}