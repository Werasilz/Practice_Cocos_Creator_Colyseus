import { _decorator, Component, Node, Label } from 'cc';
import { NetworkManager } from './NetworkManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component
{
    private static _instance: GameManager;
    public static get Instance() { return this._instance; }
    private constructor()
    {
        super();
        if (GameManager._instance != null) return;
        GameManager._instance = this;
    }

    @property({ type: Label })
    playersNameLabel: Label[] = [];

    updatePlayersName()
    {
        for (let i = 0; i < NetworkManager.Instance.playersName.length; i++)
        {
            this.playersNameLabel[i].string = NetworkManager.Instance.playersName[i];
        }
    }
}

