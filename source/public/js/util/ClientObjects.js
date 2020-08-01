export default class ClientObjects{
    constructor(p = [], b = [], w = [], e = [], playerId){
        this.players = p;
        this.bombs = b;
        this.walls = w;
        this.explosions = e;

        this.playerId = playerId;
    }

    setAll(players, bombs, explosions, walls) {
        this.setPlayers= players;
        this.bombs = bombs;
        this.explosions = explosions;
        this.walls = walls;
    }

    /** @param {any[]} players */
    set setPlayers(players){
        this.players = players;
        let lastPlayer = this.players.length-1;
        if (this.players[lastPlayer].id !== this.playerId){
            let index = this.players.findIndex(p => p.id === this.playerId);
            let temp = this.players[lastPlayer];
            this.players[lastPlayer] = this.players[index];
            this.players[index] = temp;
        }
    }

}