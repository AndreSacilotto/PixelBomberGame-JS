import Vector, { VectorZero } from "../public/js/util/Vector.js"

export default class Wall {
    constructor(position = VectorZero(), destructible = true, moveable = false, texture = "black") {
        this.destructible = destructible;
        this.moveable = moveable;
        this.position = position;
        this.texture = texture;
    }
}