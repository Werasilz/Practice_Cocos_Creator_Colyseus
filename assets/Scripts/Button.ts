import { _decorator, Component, Node, EditBox, director } from 'cc';
import { NetworkManager } from './NetworkManager';
const { ccclass, property } = _decorator;

@ccclass('Button')
export class Button extends Component
{
    @property({ type: EditBox })
    textBox: EditBox;

    Play()
    {
        NetworkManager.Instance.playerName = this.textBox.string;
        NetworkManager.Instance.connect();
        director.loadScene('GameplayScene');
    }
}
