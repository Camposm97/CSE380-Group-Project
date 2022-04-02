import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import MainMenu from "./MainMenu";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";

export default class GameOver extends Scene {
    private win: boolean
    private timeLeft: number

    initScene(options: Record<string, any>): void {
        this.win = options.win
        this.timeLeft = options.timeLeft
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
            const lblScore = <Label> this.add.uiElement(UIElementType.LABEL, MAIN_LAYER, {position: new Vec2(ctr.x, ctr.y + 50), text: `Score: ${this.timeLeft}`})
            lblScore.textColor = Color.WHITE
        } else {
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: 'lose', loop: false, holdReference: false})
        }

        const btOk = <Button> this.add.uiElement(UIElementType.BUTTON, MAIN_LAYER, {position: new Vec2(ctr.x, ctr.y + 300), text: 'Main Menu'})
        btOk.size.set(200, 50)
        btOk.borderWidth = 2
        btOk.borderColor = Color.WHITE
        btOk.backgroundColor = Color.TRANSPARENT
        btOk.onClick = () => {
            this.sceneManager.changeToScene(MainMenu, {})
        }
    }
}