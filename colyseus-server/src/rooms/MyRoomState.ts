import { Schema, type, MapSchema } from "@colyseus/schema";
import { Player } from "./Player";

export class MyRoomState extends Schema
{
    @type("number") maxClients: number = 2;
    @type("number") readyCount: number = 0;
    @type({ map: Player }) players = new MapSchema<Player>();
}
