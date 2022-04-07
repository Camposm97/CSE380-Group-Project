import Layer from "../../Wolfie2D/Scene/Layer";
import GameLevel from "../scene/GameLevel";
import Color from "../../Wolfie2D/Utils/Color";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { Events } from "../scene/Constants";
import BattlerAI from "../ai/BattlerAI";

enum LayerType {
    PRIMARY = 'primary',
    HUD = 'hud',
    PAUSE = 'pause',
    CONTROLS = 'controls'
}

export class GameLayerManager {
    private scene: GameLevel
    private primaryLayer: Layer
    private hudLayer: Layer
    private pauseLayer: Layer
    private controlsLayer: Layer

    /**
     * Initializes primary layer when constructed
     * @param scene 
     */
    constructor(scene: GameLevel) {
        this.scene = scene
        this.primaryLayer = scene.addLayer('primary', 10);
    }

    initHudLayer(): void {
        // Add a UI for health
        this.hudLayer = this.scene.addUILayer(LayerType.HUD)

        let lblHealth = <Label>(this.scene.add.uiElement(UIElementType.LABEL, LayerType.HUD, {
            position: new Vec2(60, 16),
            text: `HP: ${(<BattlerAI>this.scene.getPlayer()._ai).health}`,
        })
        );
        lblHealth.textColor = Color.WHITE;
        this.scene.setLblHealth(lblHealth)

        let lblTime = <Label>this.scene.add.uiElement(UIElementType.LABEL, LayerType.HUD, {
            position: new Vec2(360, 16),
            text: "",
        });
        lblTime.textColor = Color.WHITE;
        this.scene.setLblTime(lblTime)
    }

    initPauseLayer(): void {
        let c = this.scene.getViewport().getCenter().clone()
        const SIZE = new Vec2(200, 50) // size of each button
        this.pauseLayer = this.scene.addLayer(LayerType.PAUSE, 1)
        let btResume = <Button>this.scene.add.uiElement(UIElementType.BUTTON, LayerType.PAUSE, {
            position: new Vec2(c.x, c.y - 150),
            text: 'Resume'
        })
        btResume.backgroundColor = Color.BLACK
        btResume.borderColor = Color.WHITE
        btResume.borderWidth = 2
        btResume.size = SIZE
        btResume.onClickEventId = Events.PAUSE_GAME
        let btReset = <Button>this.scene.add.uiElement(UIElementType.BUTTON, LayerType.PAUSE, {
            position: new Vec2(c.x, c.y - 75),
            text: 'Reset Room'
        })
        btReset.backgroundColor = Color.BLACK
        btReset.borderColor = Color.WHITE
        btReset.borderWidth = 2
        btReset.size = SIZE
        btReset.onClickEventId = Events.RESET_ROOM
        let btControls = <Button>this.scene.add.uiElement(UIElementType.BUTTON, LayerType.PAUSE, {
            position: new Vec2(c.x, c.y),
            text: 'Controls'
        })
        btControls.backgroundColor = Color.BLACK
        btControls.borderColor = Color.WHITE
        btControls.borderWidth = 2
        btControls.size = SIZE
        btControls.onClickEventId = Events.SHOW_CONTROLS
        let btExit = <Button>this.scene.add.uiElement(UIElementType.BUTTON, LayerType.PAUSE, {
            position: new Vec2(c.x, c.y + 75),
            text: 'Exit'
        })
        btExit.backgroundColor = Color.BLACK
        btExit.borderColor = Color.WHITE
        btExit.borderWidth = 2
        btExit.size = SIZE
        btExit.onClickEventId = Events.EXIT_GAME
        this.pauseLayer.setHidden(true)
    }

    initControlsLayer(): void {
        this.controlsLayer = this.scene.addUILayer(LayerType.CONTROLS);
        this.controlsLayer.setHidden(true);

        const center = this.scene.getViewport().getCenter().clone()

        const controlsHeader = <Label>this.scene.add.uiElement(UIElementType.LABEL, LayerType.CONTROLS,
            {
                position: new Vec2(center.x, center.y - 300),
                text: "Controls"
            });
        controlsHeader.textColor = Color.WHITE;

        const wu = <Label>this.scene.add.uiElement(UIElementType.LABEL, LayerType.CONTROLS,
            {
                position: new Vec2(center.x, center.y - 50),
                text: "W/Up-Arrow to move up"
            });
        wu.textColor = Color.WHITE;
        const al = <Label>this.scene.add.uiElement(UIElementType.LABEL, LayerType.CONTROLS,
            {
                position: new Vec2(center.x, center.y),
                text: "A/Left-Arrow to move left"
            });
        al.textColor = Color.WHITE;
        const sd = <Label>this.scene.add.uiElement(UIElementType.LABEL, LayerType.CONTROLS,
            {
                position: new Vec2(center.x, center.y + 50),
                text: "S/Down-Arrow to move down"
            });
        sd.textColor = Color.WHITE;
        const dr = <Label>this.scene.add.uiElement(UIElementType.LABEL, LayerType.CONTROLS,
            {
                position: new Vec2(center.x, center.y + 100),
                text: "D/Right-Arrow to move right"
            });
        dr.textColor = Color.WHITE;
        const lclick = <Label>this.scene.add.uiElement(UIElementType.LABEL, LayerType.CONTROLS,
            {
                position: new Vec2(center.x, center.y + 150),
                text: "Sapce/Left-Click to attack"
            });
        lclick.textColor = Color.WHITE;
        const rclick = <Label>this.scene.add.uiElement(UIElementType.LABEL, LayerType.CONTROLS,
            {
                position: new Vec2(center.x, center.y - 100),
                text: "Shift/Right-Click to place flag"
            });
        rclick.textColor = Color.WHITE;
        const p = <Label>this.scene.add.uiElement(UIElementType.LABEL, LayerType.CONTROLS,
            {
                position: new Vec2(center.x, center.y - 150),
                text: "P - panic button, resets the room to its original sate"
            });
        p.textColor = Color.WHITE;
        const esc = <Label>this.scene.add.uiElement(UIElementType.LABEL, LayerType.CONTROLS,
            {
                position: new Vec2(center.x, center.y - 200),
                text: "ESC pause the game"
            });
        esc.textColor = Color.WHITE;

        const back = this.scene.add.uiElement(UIElementType.BUTTON, LayerType.CONTROLS,
            {
                position: new Vec2(center.x, center.y + 250),
                text: "Back"
            });
        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = Color.TRANSPARENT;
        back.onClickEventId = Events.SHOW_CONTROLS;
    }

    showPause() {
        this.primaryLayer.setHidden(!this.primaryLayer.isHidden())
      this.hudLayer.setHidden(!this.hudLayer.isHidden())
      this.pauseLayer.setHidden(!this.pauseLayer.isHidden())
      this.scene.getTilemap('Floor').visible = !this.scene.getTilemap('Floor').visible
      this.scene.getTilemap('Walls').visible = !this.scene.getTilemap('Walls').visible
      this.scene.getLayer('slots1').setHidden(!this.scene.getLayer('slots1').isHidden())
      this.scene.getLayer('items1').setHidden(!this.scene.getLayer('items1').isHidden())
      this.scene.getPlayer().setAIActive(!this.scene.getPlayer().aiActive, {})
      if (this.pauseLayer.isHidden()) {
        this.scene.getViewport().setZoomLevel(3)
      } else {
        this.scene.getViewport().setZoomLevel(1)
      }
    }

    showControls() {
        this.controlsLayer.setHidden(!this.controlsLayer.isHidden())
        this.pauseLayer.setHidden(!this.pauseLayer.isHidden())
    }
}