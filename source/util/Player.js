import Vector from "../public/js/util/Vector.js"

export default class Player {
    constructor(id, username = "Guest" + Math.round(Math.random() * 10000)) {
        this.id = id;
        this.username = username;

        this.stats;
        this.powers;

        this.position = new Vector();
        this.usedBombs = 0;

        this.alive = false;
        this.canMove = false;

        this.resetPowers();
    }

    active() {
        this.alive = true;
        this.canMove = true;
    }

    reset() {
        this.position.reset();
        this.alive = false;
        this.canMove = false;
        this.usedBombs = 0;
    }

    resetPowers() {
        this.stats = {
            lifes: 1,
            maxBombs: 1,
            firePower: 2,
            fireRadius: 0,
            speed: 1,
        };
        this.powers = {
            wallPass: false,
            bombPass: false,
            tickBomb: false,
            pierceBomb: false,
            punchBombs: false,
            lineBomb: false,
            wallCreator: false,
            blockCreator: false,
        };
    }

    willPlaceBomb() {
        if (this.canAct && this.usedBombs < this.stats.maxBombs) {
            this.usedBombs++;
            return true;
        }
        return false;
    }

    get canAct() {
        return this.alive && this.canMove;
    }

}