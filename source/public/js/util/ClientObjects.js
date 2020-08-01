export default class ClientObjects {
    constructor(playerId, p = [], b = [], w = [], e = []) {
        this.players = p;
        this.bombs = b;
        this.walls = w;
        this.explosions = e;

        this.playerId = playerId;
        this.localPlayer;
    }

    setAll(players, bombs, explosions, walls) {
        this.setPlayers = players;
        this.bombs = bombs;
        this.explosions = explosions;
        this.walls = walls;
    }

    /** @param {any[]} players */
    set setPlayers(players){
        this.localPlayer = undefined;
        const index = players.findIndex(p => p.id === this.playerId);        
        if (index > -1){
            this.localPlayer = players[index];
            players.splice(index, 1);
        }        
        this.players = players;
    }
}