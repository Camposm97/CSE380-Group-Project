import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";

export function initButton(scene: Scene, layer: string, v: Vec2, text: string) {
    let x = <Button> scene.add.uiElement(UIElementType.BUTTON, layer, {
        position: v,
        text: text
    })
    x.size.set(200, 50)
    x.font = 'Comic Sans MS'
    x.borderColor = Color.WHITE
    x.borderRadius = 15.0
    x.backgroundColor = Color.BLACK
    x.onEnter = () => {
        x.fontSize = 32
        x.size = new Vec2(215,55)
    }
    x.onLeave = () => {
        x.fontSize = 30
        x.size = new Vec2(200,50)
    }
    return x
}

export function initButtonHandler(scene: Scene, layer: string, v: Vec2, text: string, eventId: string): Button {
    let x = initButton(scene, layer, v, text)
    x.onClickEventId = eventId
    return x
}

export function initLabel(scene: Scene, layer: string, v: Vec2, text: string): Label {
    let x = <Label> scene.add.uiElement(UIElementType.LABEL, layer, {
        position: v,
        text: text
    })
    x.textColor = Color.WHITE
    x.font = "Comic Sans MS"
    return x
}