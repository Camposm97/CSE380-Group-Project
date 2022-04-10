import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import MainMenu from "./MainMenu";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import GameLevel from "./GameLevel";
import { initButton } from "../ui/UIBuilder";

export default class GameOver extends Scene {
    private currentScore: number
    private win: boolean
    private timeLeft: number
    private nextLvl: new (...args: any) => GameLevel

    initScene(options: Record<string, any>): void {
        options.currentScore ? this.currentScore = options.currentScore : this.currentScore = 0
        this.win = options.win
        this.timeLeft = options.timeLeft
        this.nextLvl = options.nextLvl
        console.log('score = ' + this.currentScore)
        console.log('time = ' + this.timeLeft)
    }

    loadScene(): void {
        this.load.audio('lose', 'res/sound/lose.wav')
    }

    startScene() {
        const MAIN_LAYER = "MAIN_LAYER"
        const ctr = this.viewport.getCenter().clone()
        this.addUILayer(MAIN_LAYER);
        const lblStatus = <Label>this.add.uiElement(UIElementType.LABEL, MAIN_LAYER, {position: new Vec2(ctr.x, ctr.y), text: 'Game Over'});
        lblStatus.textColor = Color.WHITE;

        if (this.win) {
            lblStatus.text = 'You win!'
            const lblScore = <Label> this.add.uiElement(UIElementType.LABEL, MAIN_LAYER, {position: new Vec2(ctr.x, ctr.y + 50), text: `Total Score: ${(this.timeLeft + this.currentScore)}`})
            lblScore.textColor = Color.WHITE
        } else {
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: 'lose', loop: false, holdReference: false})
        }

        let btOk = initButton(this, MAIN_LAYER, new Vec2(ctr.x, ctr.y+300), 'Main Menu', '')
        btOk.onClick = () => {
            this.sceneManager.changeToScene(MainMenu, {})
        }

        if (this.nextLvl) {
            btOk.text = 'Next Room'
            btOk.onClick = () => {
                this.sceneManager.changeToScene(this.nextLvl, {currentScore: (this.currentScore + this.timeLeft)})
            }
        }
    }
}