import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Input from "../../Wolfie2D/Input/Input";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import MainMenu from "./MainMenu";

export default class GameOver extends Scene {
    private win: boolean
    private timeLeft: number

    initScene(options: Record<string, any>): void {
        this.win = options.win
        this.timeLeft = options.timeLeft
    }

    startScene() {
        const MAIN_LAYER = "MAIN_LAYER"
        const center = this.viewport.getCenter();
        this.addUILayer(MAIN_LAYER);
        const lblStatus = <Label>this.add.uiElement(UIElementType.LABEL, MAIN_LAYER, 
            {position: new Vec2(center.x, center.y), text: 'Game Over'});
        lblStatus.textColor = Color.WHITE;

        if (this.win) {
            lblStatus.text = 'You win!'
            const lblScore = <Label> this.add.uiElement(UIElementType.LABEL, MAIN_LAYER,
                {position: new Vec2(center.x, center.y + 50), text: `Score: ${this.timeLeft}`})
            lblScore.textColor = Color.WHITE
        }

        let btOk = <Button> this.add.uiElement(UIElementType.BUTTON, MAIN_LAYER, 
            {
                position: new Vec2(center.x, center.y + 300),
                text: 'Main Menu'})
        btOk.size.set(200, 50)
        btOk.borderWidth = 2
        btOk.borderColor = Color.WHITE
        btOk.backgroundColor = Color.TRANSPARENT
        btOk.onClick = () => {
            this.sceneManager.changeToScene(MainMenu, {})
        }
    }
}