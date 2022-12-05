import { _decorator, Component, game } from 'cc';
import Colyseus from 'db://colyseus-sdk/colyseus.js';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('NetworkManager')
export class NetworkManager extends Component
{
    private static _instance: NetworkManager;
    public static get Instance() { return this._instance; }
    private constructor()
    {
        super();
        if (NetworkManager._instance != null) return;
        NetworkManager._instance = this;
    }

    @property private serverURL: string = "localhost";
    @property private port: string = "2567";
    client: Colyseus.Client | null = null;
    room: Colyseus.Room | null = null;
    maxPlayer: number = 2;

    playerName: string;
    playersName: string[] = [];

    onLoad()
    {
        let endpoint: string = `ws://${this.serverURL}:${this.port}`;
        this.client = new Colyseus.Client(endpoint);
        game.addPersistRootNode(this.node);
    }

    async connect()
    {
        this.room = await this.client!.joinOrCreate("my_room");
        console.log("Client SessionID [%o]", this.room.sessionId);

        // Send player name to server
        this.room!.send("player-name", this.playerName);

        let playerCount = 0;
        this.room.state.players.onAdd = () =>
        {
            playerCount++;

            if (playerCount === this.maxPlayer)
            {
                this.onJoin();
            }
        }
        // Receive data from Server
        this.room.onMessage("data", (data) =>
        {
            console.log("Receive data", data);
        });

        this.room.onMessage("broadcast-data", (data) =>
        {
            console.log("Receive data", data);
            this.playersName.push(data);
        });
    }

    onJoin()
    {
        console.log("Joined to room id [%o]", this.room.id);
        this.room!.send("joined");

        this.scheduleOnce(function ()
        {
            GameManager.Instance.updatePlayersName();
        }, 1);
    }
}