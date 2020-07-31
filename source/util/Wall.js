import Vector, { VectorZero } from "../public/js/util/Vector.js"

export default class Wall{
    constructor(destructible = true, moveable = false, texture = "black", position = VectorZero()){
        this.destructible = destructible;
        this.moveable = moveable;
        this.texture = texture;
        this.position = position;
    }
}