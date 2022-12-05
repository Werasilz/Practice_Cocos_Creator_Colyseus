import { Room, Client, Delayed, Clock } from "colyseus";
import { ArraySchema } from '@colyseus/schema';
import { MyRoomState } from "./MyRoomState";
import { Player } from "./Player";

export class MyRoom extends Room<MyRoomState>
{
    private static _instance: MyRoom;
    public static get Instance() { return this._instance; }
    private constructor()
    {
        super();
        if (MyRoom._instance != null) return;
        MyRoom._instance = this;
    }

    onCreate() 
    {
        let roomState = new MyRoomState();
        this.setState(roomState);

        console.log("===================[Room Created]==================");
        console.log("[Room ID] %o", this.roomId);
        console.log("===================================================");

        // Receive data from Client
        this.onMessage("joined", () => this.joined());
        this.onMessage("player-name", (client, name) => this.setPlayerName(client, name));
    }

    onJoin(client: Client)
    {
        console.log("[%o]", client.sessionId, "joined!");

        // Create player
        this.state.players.set(client.sessionId, new Player());

        // Room is full
        if (this.state.players.size === this.state.maxClients)
        {
            this.lock();
        }
    }

    onLeave(client: Client)
    {
        console.log("[%o]", client.sessionId, "left!");
    }

    onDispose()
    {
        console.log("[%o]", this.roomId, "Room disposing");
        console.log("===================================================");
    }

    /////////////////////////////////////////////////////////////////////
    //#region Receive Data from Client
    setPlayerName(client: Client, name: any)
    {
        let player = this.state.players.get(client.sessionId);
        player.name = name;
        console.log("[%o] Name [%o]", client.sessionId, player.name);
    }

    joined()
    {
        this.state.readyCount++

        if (this.state.readyCount === this.state.maxClients)
        {
            this.clients.forEach(client => 
            {
                let player = this.state.players.get(client.sessionId);
                this.broadcastData(player.name);
            });
        }
    }
    //#endregion
    /////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////
    //#region Send data to client
    sendData(client: Client, data: any)
    {
        client.send("data", data);
    }

    broadcastData(data: any)
    {
        this.broadcast("broadcast-data", data);
    }
    //#endregion
    /////////////////////////////////////////////////////////////////////
}