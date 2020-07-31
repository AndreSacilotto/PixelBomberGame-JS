export default class Vector{
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }

    /** @param {number} x @param {number} y*/
    set(x, y){
        this.x = x;
        this.y = y;
    }

    /** @param {{x: number, y: number}} objectValue */
    setByObject(objectValue){
        this.x = objectValue.x;
        this.y = objectValue.y;
    }

    /**@param {number} value */
    multiplication(value){
        this.x *= value;
        this.y *= value;
    }
    /**@param {number} value */
    sum(value){
        this.x += value;
        this.y += value;
    }

    /**@param {number} x */
    /**@param {number} y */
    equal(x, y){
        return x === this.x && y === this.y;
    }

    /**@param {Vector} vector */
    multiplicationVector(vector){
        this.x *= vector.x;
        this.y *= vector.y;
    }

    /**@param {Vector} vector */
    sumVector(vector){
        this.x += vector.x;
        this.y += vector.y;
    }

    /**@param {Vector} vector */
    equalVector(vector){
        return vector.x === this.x && vector.y === this.y;
    }

    get getVector(){
        const x = this.x;
        const y = this.y;
        return {x, y};
    }

    reset(){
        this.x = 0;
        this.y = 0;
    }
}

export function VectorUp(){ return new Vector(0,1)}
export function VectorDown(){ return new Vector(0,-1)}
export function VectorRight(){ return new Vector(1,0)}
export function VectorLeft(){ return new Vector(-1,0)}
export function VectorZero(){ return new Vector()}
