export default class ClientObjects{
    constructor(p = [], b = [], w = [], e = []){
        this.players = p;
        this.bombs = b;
        this.walls = w;
        this.explosions = e;
    }

    getPlayer(id){
        return this.players.find(p => p.id === id);
    }
    addPlayer(player){
        this.players.push(player);
    }
    addBomb(bomb){
        this.bombs.push(bomb);
    }
    addExplosion(explosion){
        this.explosions.push(explosion);
    }
    addWall(wall){
        this.walls.push(wall);
    }    

    removePlayer(player){
        arrayRemove(this.players, player);
    }
    removeBomb(bomb){
        arrayRemove(this.bombs, bomb);
    }
    removeExplosion(explosion){
        arrayRemove(this.explosions, explosion);
    }
    removeWall(wall){
        arrayRemove(this.walls, wall);
    }
}

/** @param {any[]} array @param {any} element */
export function arrayRemove(array, element) { 
    const index = array.indexOf(element);
    let temp;
    if (index > -1){
        temp = array[index];
        array.splice(index, 1);
    }
    return temp;
}