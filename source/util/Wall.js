import Vector, { VectorZero } from "../public/js/util/Vector.js"

export default class Wall {
    constructor(destructible = true, moveable = false, position = VectorZero(), texture = "black") {
        this.destructible = destructible;
        this.moveable = moveable;
        this.position = position;
        this.texture = texture;
    }
}