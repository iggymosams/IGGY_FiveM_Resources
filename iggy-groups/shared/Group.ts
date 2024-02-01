import { Player } from "qbcore.js";

export class Group {
    id: number;
    leader: Player;
    players: Player[];

    constructor(id: number, leader: Player) {
        this.id = id;
        this.leader = leader;
        this.players = [];
    }

    addPlayer(player: Player) {
        console.log(player.PlayerData.cid);
        this.players = [...this.players, player];
    }

    removePlayer(cid: string) {
        if (this.leader.PlayerData.citizenid === cid) {
            this.promotePlayer(this.players[0]);
        }
        this.players = this.players.filter(
            (player) => player.PlayerData.citizenid !== cid
        );
    }

    promotePlayer(player: Player) {
        this.removePlayer(player.PlayerData.citizenid);
        this.leader = player;
        emitNet(
            "iggy-groups:client:promotePlayer",
            this.leader.PlayerData.source
        );
    }
}
